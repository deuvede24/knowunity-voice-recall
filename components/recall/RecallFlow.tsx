"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { PhoneShell } from "@/components/PhoneShell";
import { RecallTopBar } from "@/components/TopBar";
import { PermissionPrimer } from "@/components/PermissionPrimer";
import { TextButton } from "@/components/Buttons";
import { CONCEPTS } from "@/lib/concepts";
import type {
  CoachingBand,
  ConceptOutcomeStatus,
  ConfirmationMode,
  Expression,
} from "@/lib/types";
import {
  getConfirmationMode,
  setConfirmationMode as persistConfirmationMode,
  getHasOpenedModeSelector,
  setHasOpenedModeSelector,
  getHasSeenPermissionPrimer,
  setHasSeenPermissionPrimer,
} from "@/lib/storage";
import { gentle } from "@/lib/motion";

import { ConceptHeader } from "./ConceptHeader";
import { RecordingArea } from "./RecordingArea";
import { ConfirmationLayer } from "./ConfirmationLayer";
import { ThinkingCard } from "./ThinkingCard";
import { CoachingCard } from "./CoachingCard";
import { TypeInsteadSheet } from "./TypeInsteadSheet";
import { SummaryScreen } from "./SummaryScreen";

type Stage =
  | "recording" // idle | recording | paused handled inside RecordingArea
  | "confirmation"
  | "thinking"
  | "coaching"
  | "skipped"
  | "summary";

type RecordingPhase = "idle" | "recording" | "paused";

interface AttemptOutcome {
  band: CoachingBand;
  expression: Expression;
  copy: { title: string; body: string };
  reminder?: string;
}

function getAttemptOutcome(
  conceptIndex: number,
  isRetry: boolean,
): AttemptOutcome {
  const concept = CONCEPTS[conceptIndex];
  if (isRetry) {
    // Deterministic fallback: concepts without an authored retry (SPEC.md §9)
    // repeat their first-attempt band rather than inventing a new outcome.
    return (
      concept.retry ?? {
        band: concept.firstAttemptBand,
        expression: concept.firstAttemptExpression,
        copy: concept.firstAttemptCopy,
      }
    );
  }
  return {
    band: concept.firstAttemptBand,
    expression: concept.firstAttemptExpression,
    copy: concept.firstAttemptCopy,
  };
}

export function RecallFlow() {
  const router = useRouter();

  const [showPrimer, setShowPrimer] = useState(false);
  const [primerReady, setPrimerReady] = useState(false);

  const [conceptIndex, setConceptIndex] = useState(0);
  const [isRetry, setIsRetry] = useState(false);
  const [recordingPhase, setRecordingPhase] = useState<RecordingPhase>("idle");
  const [stage, setStage] = useState<Stage>("recording");
  const [typeSheetOpen, setTypeSheetOpen] = useState(false);

  const [confirmationMode, setConfirmationModeState] =
    useState<ConfirmationMode>("transcript");
  const [showDiscoveryDot, setShowDiscoveryDot] = useState(true);

  const [outcomes, setOutcomes] = useState<
    Record<string, ConceptOutcomeStatus>
  >({});

  useEffect(() => {
    setShowPrimer(!getHasSeenPermissionPrimer());
    setConfirmationModeState(getConfirmationMode());
    setShowDiscoveryDot(!getHasOpenedModeSelector());
    setPrimerReady(true);
  }, []);

  const concept = CONCEPTS[conceptIndex];
  const isLastConcept = conceptIndex === CONCEPTS.length - 1;

  function dismissPrimer() {
    setHasSeenPermissionPrimer();
    setShowPrimer(false);
  }

  function handleModeChange(mode: ConfirmationMode) {
    setConfirmationModeState(mode);
    persistConfirmationMode(mode);
  }

  function handleModeSelectorOpened() {
    setHasOpenedModeSelector();
    setShowDiscoveryDot(false);
  }

  function proceedAfterAnswer() {
    if (confirmationMode === "none") {
      setStage("thinking");
    } else {
      setStage("confirmation");
    }
  }

  function advanceToNextConceptOrSummary() {
    if (isLastConcept) {
      setStage("summary");
    } else {
      setConceptIndex((i) => i + 1);
      setIsRetry(false);
      setRecordingPhase("idle");
      setStage("recording");
    }
  }

  function handleSkip() {
    setOutcomes((o) => ({ ...o, [concept.id]: "practising" }));
    setStage("skipped");
  }

  useEffect(() => {
    if (stage !== "skipped") return;
    const t = setTimeout(advanceToNextConceptOrSummary, 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  useEffect(() => {
    if (stage !== "thinking") return;
    const t = setTimeout(() => setStage("coaching"), 1300);
    return () => clearTimeout(t);
  }, [stage]);

  const attempt = getAttemptOutcome(conceptIndex, isRetry);

  function handleCoachingAction() {
    if (attempt.band === "gotIt") {
      setOutcomes((o) => ({
        ...o,
        [concept.id]: concept.id === "furigana" ? "practising" : "gotIt",
      }));
      advanceToNextConceptOrSummary();
    } else {
      setIsRetry(true);
      setRecordingPhase("idle");
      setStage("recording");
    }
  }

  if (!primerReady) return null;

  return (
    <PhoneShell>
      {showPrimer ? (
        <PermissionPrimer
          onAllow={dismissPrimer}
          onTypeInstead={() => {
            dismissPrimer();
            setTypeSheetOpen(true);
          }}
        />
      ) : (
        <>
          <RecallTopBar
            fraction={
              (conceptIndex + (stage === "summary" ? 1 : 0)) / CONCEPTS.length
            }
            term={
              stage === "summary"
                ? undefined
                : { current: conceptIndex + 1, total: CONCEPTS.length }
            }
            onExit={() => router.push("/")}
          />

          {(stage === "recording" ||
            stage === "thinking" ||
            stage === "coaching") && (
            <ConceptHeader
              primaryText={
                <>
                  Explain in your own words:{" "}
                  <span className="font-semibold text-ink-primary">
                    {concept.term}
                  </span>
                </>
              }
              expression={
                stage === "coaching"
                  ? attempt.expression
                  : stage === "thinking"
                    ? "thinking"
                    : "standby"
              }
              animateBob={stage === "thinking"}
              reminder={
                isRetry && stage === "recording"
                  ? (attempt.reminder ?? "Reminder: give it another go.")
                  : undefined
              }
            />
          )}

          {stage === "confirmation" && (
            <ConceptHeader
              primaryText={
                confirmationMode === "headline"
                  ? "You explained"
                  : "Here's what I heard"
              }
              expression="standby"
            />
          )}

          {/* No mode="wait": that would delay each stage's mount (and its
              own timers, e.g. the thinking delay) until the previous
              stage's exit animation fully finished, stacking extra latency
              on top of the intended ~1.2s thinking delay. */}
          <AnimatePresence>
            {stage === "recording" && (
              <motion.div
                key="recording-stage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={gentle}
                className="flex flex-1 flex-col"
              >
                <div className="flex flex-1 flex-col items-center justify-center gap-400 px-400 pb-400">
                  <RecordingArea
                    phase={recordingPhase}
                    confirmationMode={confirmationMode}
                    onChangeConfirmationMode={handleModeChange}
                    showDiscoveryDot={showDiscoveryDot}
                    onModeSelectorOpened={handleModeSelectorOpened}
                    onStart={() => setRecordingPhase("recording")}
                    onPause={() => setRecordingPhase("paused")}
                    onResume={() => setRecordingPhase("recording")}
                    onDiscard={() => setRecordingPhase("idle")}
                    onSend={proceedAfterAnswer}
                  />

                  <div className="flex items-center gap-400">
                    <TextButton
                      onClick={() => setTypeSheetOpen(true)}
                      className="underline"
                    >
                      Type instead
                    </TextButton>
                    <TextButton onClick={handleSkip} className="underline">
                      Skip for now
                    </TextButton>
                  </div>
                </div>
              </motion.div>
            )}

            {stage === "confirmation" && (
              <ConfirmationLayer
                key="confirmation-stage"
                mode={
                  confirmationMode === "none" ? "transcript" : confirmationMode
                }
                transcript={concept.transcript}
                headline={concept.headline}
                onContinue={() => setStage("thinking")}
              />
            )}

            {stage === "thinking" && (
              <motion.div
                key="thinking-stage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-1 flex-col"
              >
                <ThinkingCard />
              </motion.div>
            )}

            {stage === "coaching" && (
              <motion.div
                key="coaching-stage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-1 flex-col"
              >
                <CoachingCard
                  band={attempt.band}
                  title={attempt.copy.title}
                  body={attempt.copy.body}
                  onAction={handleCoachingAction}
                />
              </motion.div>
            )}

            {stage === "skipped" && (
              <motion.div
                key="skipped-stage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-1 flex-col items-center justify-center gap-300"
              >
                <p className="text-body-m font-semibold text-ink-primary">
                  Skipped for now
                </p>
              </motion.div>
            )}

            {stage === "summary" && (
              <SummaryScreen
                key="summary-stage"
                concepts={CONCEPTS}
                outcomes={outcomes}
                onContinue={() => router.push("/")}
              />
            )}
          </AnimatePresence>

          <TypeInsteadSheet
            open={typeSheetOpen}
            term={concept.term}
            initialValue={concept.transcript}
            onDismiss={() => setTypeSheetOpen(false)}
            onSend={() => {
              setTypeSheetOpen(false);
              proceedAfterAnswer();
            }}
          />
        </>
      )}
    </PhoneShell>
  );
}

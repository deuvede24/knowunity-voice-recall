"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { PhoneShell } from "@/components/PhoneShell";
import { RecallTopBar } from "@/components/TopBar";
import { PermissionPrimer } from "@/components/PermissionPrimer";
import { TextButton } from "@/components/Buttons";
import { CONCEPTS, MILESTONE_MESSAGES } from "@/lib/concepts";
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
import { BottomActionBar } from "./BottomActionBar";
import { RecordingArea } from "./RecordingArea";
import { CoachingCard } from "./CoachingCard";
import { TypeInsteadSheet } from "./TypeInsteadSheet";
import { SummaryScreen } from "./SummaryScreen";

type Stage =
  | "recording" // idle | recording | paused | review handled inside RecordingArea
  | "thinking" // "Let me think..." replaces the question inside the same persistent bubble — no separate screen
  | "coaching"
  | "milestone" // brief encouragement inside the same bubble after Q2/Q3, auto-advances
  | "skipped"
  | "summary";

type RecordingPhase = "idle" | "recording" | "paused" | "review";

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
    const frame = requestAnimationFrame(() => {
      setShowPrimer(!getHasSeenPermissionPrimer());
      setConfirmationModeState(getConfirmationMode());
      setShowDiscoveryDot(!getHasOpenedModeSelector());
      setPrimerReady(true);
    });

    return () => cancelAnimationFrame(frame);
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
      setRecordingPhase("review");
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
    // setOutcomes((o) => ({ ...o, [concept.id]: "practising" }));
    //setStage("skipped");
    advanceToNextConceptOrSummary();
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

  // Milestone messages (after Q2/Q3 only, per MILESTONE_MESSAGES) auto-advance
  // the same way Thinking auto-advances into Coaching — no extra tap. Visible
  // just long enough to comfortably read (~0.8-1.2s) before moving on.
  useEffect(() => {
    if (stage !== "milestone") return;
    const t = setTimeout(advanceToNextConceptOrSummary, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const attempt = getAttemptOutcome(conceptIndex, isRetry);
  const milestone = MILESTONE_MESSAGES[conceptIndex];

  function handleCoachingAction() {
    if (attempt.band === "gotIt") {
      setOutcomes((o) => ({
        ...o,
        [concept.id]: concept.id === "furigana" ? "practising" : "gotIt",
      }));
      if (milestone) {
        setStage("milestone");
      } else {
        advanceToNextConceptOrSummary();
      }
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
              stage === "summary" ? 1 : (conceptIndex + 1) / CONCEPTS.length
            }
            term={
              stage === "summary"
                ? undefined
                : { current: conceptIndex + 1, total: CONCEPTS.length }
            }
            onExit={() => router.push("/")}
          />

          {/* One persistent ConceptHeader instance across recording → review
              → thinking → milestone → coaching (rather than several
              conditionally-mounted blocks) so React keeps the same DOM node
              instead of unmounting and remounting it — that remount was one
              source of the layout jump between stages. Thinking and
              milestone messages render inside this same bubble instead of a
              separate screen, per this pass's "stable conversational area." */}
          {stage !== "skipped" && stage !== "summary" && (
            <ConceptHeader
              primaryText={
                stage === "thinking" ? (
                  <p className="text-body-m font-semibold text-ink-primary">Let me think...</p>
                ) : stage === "milestone" && milestone ? (
                  <>
                    <p className="text-headline-s font-black text-ink-primary">
                      {milestone.title}
                    </p>
                    <p className="text-body-s text-ink-secondary">{milestone.body}</p>
                  </>
                ) : stage === "recording" && recordingPhase === "review" ? (
                  <p className="text-body-m font-semibold text-ink-primary">
                    {confirmationMode === "headline" ? "You explained" : "Here's what I heard"}
                  </p>
                ) : (
                  <>
                    {/* Supporting instruction (secondary emphasis) above the
                        main concept (visual focus) — same header/caption
                        hierarchy idea as header.svg, adapted to our own
                        content order rather than copied literally. */}
                    <p className="text-caption-m text-ink-secondary">
                      Explain in your own words
                    </p>
                    <p className="text-headline-s font-black text-ink-primary">
                      {concept.term}
                    </p>
                  </>
                )
              }
              expression={
                stage === "milestone"
                  ? "excited"
                  : stage === "coaching"
                    ? attempt.expression
                    : stage === "thinking"
                      ? "thinking"
                      : recordingPhase === "review"
                        ? "approving"
                        : "standby"
              }
              animateBob={stage === "thinking"}
              animateBounce={
                stage === "milestone" || (stage === "coaching" && attempt.band === "gotIt")
              }
              reminder={
                isRetry && stage === "recording" && recordingPhase !== "review"
                  ? (attempt.reminder ?? "Reminder: give it another go.")
                  : undefined
              }
            />
          )}

          {/* No mode="wait": that would delay each stage's mount (and its
              own timers, e.g. the thinking delay) until the previous
              stage's exit animation fully finished, stacking extra latency
              on top of the intended ~1.2s thinking delay. Without mode="wait"
              the outgoing and incoming stage are briefly both mounted at
              once — with normal-flow siblings that stacked their heights
              and caused a visible jump, so every stage below is positioned
              absolute inset-0 within this single relative/flex-1 box instead,
              so they overlap in place rather than pushing each other in the
              document flow. (Summary is intentionally left as-is: it's out
              of scope for this pass.) */}
          <div className="relative flex-1">
            <AnimatePresence>
              {stage === "recording" && !typeSheetOpen && (
                <motion.div
                  key="recording-stage"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={gentle}
                  className="absolute inset-0 flex flex-col"
                >
                {/* Mic stays centered in its own flex-1 zone, sized off
                    whatever space remains above the buttons — its position
                    doesn't depend on the buttons row at all, so pinning that
                    row near the bottom (below) can't shift the mic. */}
                <div className="flex flex-1 flex-col items-center justify-center px-400">
                  <RecordingArea
                    phase={recordingPhase}
                    confirmationMode={confirmationMode}
                    onChangeConfirmationMode={handleModeChange}
                    showDiscoveryDot={showDiscoveryDot}
                    onModeSelectorOpened={handleModeSelectorOpened}
                    transcript={concept.transcript}
                    headline={concept.headline}
                    onStart={() => setRecordingPhase("recording")}
                    onPause={() => setRecordingPhase("paused")}
                    onResume={() => setRecordingPhase("recording")}
                    onDiscard={() => setRecordingPhase("idle")}
                    onSend={proceedAfterAnswer}
                    onStartOver={() => setRecordingPhase("idle")}
                    onConfirm={() => setStage("thinking")}
                  />
                </div>

                <BottomActionBar>
                  {/* Type instead / Skip only make sense before Send — kept
                      mounted (just invisible) during Review so the footer's
                      reserved height never changes and the composer above
                      never shifts. */}
                  <div
                    className={`flex items-center justify-center gap-400 ${
                      recordingPhase === "review" ? "invisible" : ""
                    }`}
                    aria-hidden={recordingPhase === "review"}
                  >
                    <TextButton
                      onClick={() => setTypeSheetOpen(true)}
                      className="underline"
                      tabIndex={recordingPhase === "review" ? -1 : undefined}
                    >
                      Type instead
                    </TextButton>
                    <TextButton
                      onClick={handleSkip}
                      className="underline"
                      tabIndex={recordingPhase === "review" ? -1 : undefined}
                    >
                      Skip for now
                    </TextButton>
                  </div>
                </BottomActionBar>
              </motion.div>
            )}

            {stage === "recording" && typeSheetOpen && (
              <TypeInsteadSheet
                key="type-instead-stage"
                initialValue={concept.transcript}
                onDismiss={() => setTypeSheetOpen(false)}
                onSend={() => {
                  // Typed answers skip Transcript/Headline confirmation
                  // entirely and go straight to Thinking, regardless of
                  // confirmationMode — there's nothing to confirm when
                  // Helena just typed it herself.
                  setTypeSheetOpen(false);
                  setStage("thinking");
                }}
              />
            )}

            {/* Thinking has no content of its own — "Let me think..."
                replaces the question inside the persistent ConceptHeader
                bubble above, so this stage just needs to exist for
                AnimatePresence's fade timing, not render anything. */}
            {stage === "thinking" && (
              <motion.div
                key="thinking-stage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col"
              />
            )}

            {/* Milestone messages likewise live entirely in the persistent
                bubble above — no second bubble/screen here either. */}
            {stage === "milestone" && (
              <motion.div
                key="milestone-stage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col"
              />
            )}

            {stage === "coaching" && (
              <motion.div
                key="coaching-stage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col"
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
                className="absolute inset-0 flex flex-col items-center justify-center gap-300"
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
          </div>
        </>
      )}
    </PhoneShell>
  );
}

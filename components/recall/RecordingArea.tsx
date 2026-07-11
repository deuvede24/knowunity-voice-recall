"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { MicIcon } from "@/components/MicIcon";
import { IconButton } from "@/components/Buttons";
import { PlayIcon, PauseIcon, DiscardIcon, SendIcon, CheckIcon } from "@/components/icons";
import { soft, snappy } from "@/lib/motion";
import { ModeSelector } from "./ModeSelector";
import { ConfirmationLayer } from "./ConfirmationLayer";
import type { ConfirmationMode } from "@/lib/types";

type Phase = "idle" | "recording" | "paused" | "review";
type ReplayStatus = "stopped" | "playing" | "paused";

const WAVEFORM_BARS = [6, 14, 20, 12, 8, 16, 10];
// Fade/scale entrance for Recording/Paused/Review's control rows, per spec
// (~150-200ms) — reuses `soft`'s easing curve, tightened to a punchier
// duration.
const rowEntrance = { ...soft, duration: 0.18 };
// Fixed total height for the composer's central slot — identical across
// Idle / Recording / Paused / Review so Knowie, the question, and everything
// around the composer never shifts. Shorter phases simply center inside it;
// Review's card fills whatever's left below its button row.
const COMPOSER_HEIGHT = 340;

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Secondary circular control — Discard / Replay / Send / the Review actions.
 * Every column reserves the same icon-zone and caption-zone height so a row
 * of these (plus the large primary button) aligns on one baseline. */
function ControlIcon({
  icon,
  label,
  ariaLabel,
  onClick,
  tone = "neutral",
  size = "lg",
}: {
  icon: React.ReactNode;
  label: string;
  ariaLabel: string;
  onClick: () => void;
  tone?: "neutral" | "confirm";
  size?: "lg" | "xl";
}) {
  return (
    <div className="flex flex-col items-center gap-100">
      <div className="flex h-20 items-center justify-center">
        <IconButton
          size={size}
          onClick={onClick}
          aria-label={ariaLabel}
          className={tone === "confirm" ? "bg-success-bold text-success-onbold" : "bg-surface text-ink-primary"}
        >
          {icon}
        </IconButton>
      </div>
      <span className="text-caption-s text-ink-secondary">{label}</span>
    </div>
  );
}

/** The large primary control — mic (Idle), Pause (Recording, red, pulsing),
 * or mic again (Paused/"Resume") — always the same circular control, per
 * spec ("Pause and Resume always reuse the same large central button"). */
function PrimaryButton({
  phase,
  onClick,
  reduceMotion,
}: {
  phase: Exclude<Phase, "review">;
  onClick: () => void;
  reduceMotion: boolean;
}) {
  const isLive = phase === "recording";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      animate={isLive && !reduceMotion ? { scale: [1, 1.08, 1] } : { scale: 1 }}
      transition={isLive && !reduceMotion ? { duration: 1, repeat: Infinity, repeatType: "reverse" } : snappy}
      aria-label={phase === "idle" ? "Tap to speak" : phase === "recording" ? "Pause recording" : "Resume recording"}
      className={`flex h-[86px] w-[86px] items-center justify-center rounded-full ${
        isLive ? "bg-error-bold text-ink-primary" : "bg-interactive-primary text-interactive-onprimary"
      }`}
    >
      {isLive ? <PauseIcon size={30} /> : <MicIcon size={34} />}
    </motion.button>
  );
}

/**
 * The recall voice composer. Idle / Recording / Paused / Review share one
 * fixed-height layout so nothing above or below the composer shifts as the
 * phase changes — only the content inside the central slot swaps.
 */
export function RecordingArea({
  phase,
  confirmationMode,
  onChangeConfirmationMode,
  showDiscoveryDot,
  onModeSelectorOpened,
  transcript,
  headline,
  onStart,
  onPause,
  onResume,
  onDiscard,
  onSend,
  onStartOver,
  onConfirm,
}: {
  phase: Phase;
  confirmationMode: ConfirmationMode;
  onChangeConfirmationMode: (mode: ConfirmationMode) => void;
  showDiscoveryDot: boolean;
  onModeSelectorOpened: () => void;
  transcript: string;
  headline: string;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onDiscard: () => void;
  onSend: () => void;
  onStartOver: () => void;
  onConfirm: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [replayStatus, setReplayStatus] = useState<ReplayStatus>("stopped");
  const [replaySeconds, setReplaySeconds] = useState(0);
  const reduceMotion = useReducedMotion();
  const isLive = phase === "recording";

  // Reset the recorded timer on re-entering Idle, and the replay sub-state
  // on leaving Paused — adjusted during render (React's recommended pattern
  // for state that depends on a prop changing) rather than via setState
  // inside an effect, which would trigger cascading renders.
  const [prevPhase, setPrevPhase] = useState(phase);
  if (phase !== prevPhase) {
    setPrevPhase(phase);
    if (phase === "idle") setElapsed(0);
    if (phase !== "paused") {
      setReplayStatus("stopped");
      setReplaySeconds(0);
    }
  }

  useEffect(() => {
    if (phase !== "recording") return;
    const interval = setInterval(() => {
      setElapsed((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (replayStatus !== "playing") return;
    const t = setInterval(() => {
      setReplaySeconds((s) => {
        if (s + 1 >= elapsed) {
          setReplayStatus("stopped");
          return 0;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [replayStatus, elapsed]);

  function handleReplayToggle() {
    if (replayStatus === "playing") {
      setReplayStatus("paused");
    } else if (replayStatus === "paused") {
      setReplayStatus("playing");
    } else {
      setReplaySeconds(0);
      setReplayStatus("playing");
    }
  }

  const isReplayAnimating = replayStatus === "playing";
  const isReplayContext = replayStatus !== "stopped";
  const isAnimatingWaveform = isLive || isReplayAnimating;
  const timeLabel = replayStatus === "stopped" ? formatTime(elapsed) : formatTime(replaySeconds);

  return (
    <div className="flex w-full flex-col items-center" style={{ height: COMPOSER_HEIGHT }}>
      <AnimatePresence mode="wait">
        {phase === "review" ? (
          <motion.div
            key="review"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={soft}
            className="flex h-full w-full flex-col gap-400"
          >
            <ConfirmationLayer
              mode={confirmationMode === "headline" ? "headline" : "transcript"}
              transcript={transcript}
              headline={headline}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={rowEntrance}
              className="flex w-full items-center justify-between"
            >
              <ControlIcon
                icon={<DiscardIcon size={24} />}
                label="Start over"
                ariaLabel="Start over — record again from scratch"
                onClick={onStartOver}
              />
              <ControlIcon
                icon={<CheckIcon size={24} />}
                label="Continue"
                ariaLabel="Yes, that's right — continue"
                onClick={onConfirm}
                tone="confirm"
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="composer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={soft}
            className="flex h-full w-full flex-col items-center justify-center gap-200"
          >
            {/* Waveform + timer slot — empty in Idle, live in Recording, frozen in
                Paused (except during Replay, which reuses the same pulse in the
                purple/interactive tint to read as "listening back" rather than
                "recording"). */}
            <div className="flex h-16 flex-col items-center justify-center gap-100">
              {phase !== "idle" && (
                <>
                  <div className="flex h-8 items-center gap-050" aria-hidden>
                    {WAVEFORM_BARS.map((h, i) => (
                      <motion.span
                        key={i}
                        className={`w-1 rounded-full ${isReplayContext ? "bg-purple-bold" : "bg-error-bold"}`}
                        style={{ height: h }}
                        animate={isAnimatingWaveform && !reduceMotion ? { scaleY: [1, 1.6, 1] } : { scaleY: 1 }}
                        transition={
                          isAnimatingWaveform && !reduceMotion
                            ? { duration: 0.8, repeat: Infinity, repeatType: "reverse", delay: i * 0.06 }
                            : { duration: 0 }
                        }
                      />
                    ))}
                  </div>
                  <span className="text-caption-m text-ink-secondary">{timeLabel}</span>
                </>
              )}
            </div>

            {/* Primary row — the large Mic/Pause/Resume button, always in this
                exact same row/position across Idle/Recording/Paused. Never
                wrapped in an AnimatePresence key so it never remounts or
                shifts — only its own icon/color change with the phase. */}
            <div className="flex items-center justify-center">
              <PrimaryButton
                phase={phase}
                onClick={phase === "recording" ? onPause : phase === "paused" ? onResume : onStart}
                reduceMotion={!!reduceMotion}
              />
            </div>

            {/* Secondary row underneath — caption+chip (Idle); Discard/Send
                (Recording); Discard/Replay/Send (Paused). Discard always
                left, Send always right; Replay is purely an addition to
                this row and never affects the primary button above. */}
            <div className="flex w-full flex-1 flex-col items-center justify-center gap-200">
              <AnimatePresence mode="wait">
                {phase === "idle" && (
                  <motion.div
                    key="idle-secondary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={soft}
                    className="flex flex-col items-center gap-200"
                  >
                    <span className="text-caption-m text-ink-secondary">Tap to speak</span>
                    <ModeSelector
                      mode={confirmationMode}
                      onChange={onChangeConfirmationMode}
                      showDiscoveryDot={showDiscoveryDot}
                      onOpened={onModeSelectorOpened}
                    />
                  </motion.div>
                )}

                {phase === "recording" && (
                  <motion.div
                    key="recording-secondary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={soft}
                    className="flex -translate-y-5 items-center justify-center gap-400"
                  >
                    <ControlIcon
                      size="xl"
                      icon={<DiscardIcon size={26} />}
                      label="Discard"
                      ariaLabel="Discard and start again"
                      onClick={onDiscard}
                    />
                    <ControlIcon
                      size="xl"
                      icon={<SendIcon size={26} />}
                      label="Send"
                      ariaLabel="Send recording"
                      onClick={onSend}
                    />
                  </motion.div>
                )}

                {phase === "paused" && (
                  <motion.div
                    key="paused-secondary"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={rowEntrance}
                    className="flex -translate-y-5 items-center justify-center gap-400"
                  >
                    <ControlIcon
                      size="xl"
                      icon={<DiscardIcon size={26} />}
                      label="Discard"
                      ariaLabel="Discard and start again"
                      onClick={onDiscard}
                    />
                    <ControlIcon
                      size="xl"
                      icon={isReplayAnimating ? <PauseIcon size={26} /> : <PlayIcon size={26} />}
                      label={isReplayAnimating ? "Playing" : "Replay"}
                      ariaLabel={isReplayAnimating ? "Pause playback" : "Play back your recording"}
                      onClick={handleReplayToggle}
                    />
                    <ControlIcon
                      size="xl"
                      icon={<SendIcon size={26} />}
                      label="Send"
                      ariaLabel="Send recording"
                      onClick={onSend}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

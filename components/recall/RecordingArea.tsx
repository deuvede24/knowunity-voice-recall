"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MicIcon } from "@/components/MicIcon";
import { IconButton } from "@/components/Buttons";
import { PlayIcon, PauseIcon, DiscardIcon, SendIcon } from "@/components/icons";
import { soft } from "@/lib/motion";
import { ModeSelector } from "./ModeSelector";
import type { ConfirmationMode } from "@/lib/types";

type Phase = "idle" | "recording" | "paused";

const WAVEFORM_BARS = [6, 14, 20, 12, 8, 16, 10];
// Fade/scale entrance for the paused controls, per spec (~150-200ms) —
// reuses `soft`'s easing curve, tightened to a punchier duration.
const pausedEntrance = { ...soft, duration: 0.18 };

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function ControlIcon({
  icon,
  label,
  ariaLabel,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  ariaLabel: string;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-100">
      <IconButton onClick={onClick} aria-label={ariaLabel} className="bg-surface text-ink-primary">
        {icon}
      </IconButton>
      <span className="text-caption-s text-ink-secondary">{label}</span>
    </div>
  );
}

/**
 * The recall voice composer. Idle / Recording / Paused share one fixed-height
 * layout (waveform+timer slot, button slot, controls slot) so nothing above
 * or below the composer shifts as the phase changes — only the content
 * inside each slot swaps.
 */
export function RecordingArea({
  phase,
  confirmationMode,
  onChangeConfirmationMode,
  showDiscoveryDot,
  onModeSelectorOpened,
  onStart,
  onPause,
  onResume,
  onDiscard,
  onSend,
}: {
  phase: Phase;
  confirmationMode: ConfirmationMode;
  onChangeConfirmationMode: (mode: ConfirmationMode) => void;
  showDiscoveryDot: boolean;
  onModeSelectorOpened: () => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onDiscard: () => void;
  onSend: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [isReplaying, setIsReplaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reduceMotion = useReducedMotion();
  const isLive = phase === "recording";

  useEffect(() => {
    if (phase === "recording") {
      intervalRef.current = setInterval(() => {
        setElapsed((s) => s + 1);
      }, 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
    if (phase === "idle") {
      setElapsed(0);
    }
  }, [phase]);

  useEffect(() => {
    if (!isReplaying) return;
    const t = setTimeout(() => setIsReplaying(false), 1600);
    return () => clearTimeout(t);
  }, [isReplaying]);

  const isAnimatingWaveform = isLive || isReplaying;

  return (
    <div className="flex flex-col items-center gap-200">
      {/* Waveform + timer slot — empty in Idle, live in Recording, frozen in
          Paused (except during the mocked replay, which reuses the same
          pulse in the purple/interactive tint to read as "listening back"
          rather than "recording"). */}
      <div className="flex h-16 flex-col items-center justify-center gap-100">
        {phase !== "idle" && (
          <>
            <div className="flex h-8 items-center gap-050" aria-hidden>
              {WAVEFORM_BARS.map((h, i) => (
                <motion.span
                  key={i}
                  className={`w-1 rounded-full ${isReplaying ? "bg-purple-bold" : "bg-error-bold"}`}
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
            <span className="text-caption-m text-ink-secondary">
              {isReplaying ? "Playing..." : formatTime(elapsed)}
            </span>
          </>
        )}
      </div>

      {/* Button slot — Mic in Idle; becomes Send from the first tap onward
          and never reverts, in Recording and Paused alike. */}
      <div className="flex h-20 items-center justify-center">
        <motion.button
          type="button"
          onClick={phase === "idle" ? onStart : onSend}
          whileTap={{ scale: 0.94 }}
          animate={isLive && !reduceMotion ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={
            isLive && !reduceMotion
              ? { duration: 1, repeat: Infinity, repeatType: "reverse" }
              : { type: "spring", stiffness: 400, damping: 28 }
          }
          aria-label={phase === "idle" ? "Tap to speak" : "Send recording"}
          className={`flex h-20 w-20 items-center justify-center rounded-full ${
            phase === "idle"
              ? "bg-interactive-primary text-interactive-onprimary"
              : "bg-error-bold text-ink-primary"
          }`}
        >
          {phase === "idle" ? <MicIcon size={32} /> : <SendIcon size={28} />}
        </motion.button>
      </div>

      {/* Controls slot — caption + mode selector (Idle), Pause/Discard
          (Recording), or Play/Resume/Discard (Paused). */}
      <div className="flex min-h-[84px] flex-col items-center justify-center gap-200">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div
              key="idle-controls"
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
              key="recording-controls"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={soft}
              className="flex items-center gap-400"
            >
              <ControlIcon
                icon={<PauseIcon size={18} />}
                label="Pause"
                ariaLabel="Pause recording"
                onClick={onPause}
              />
              <ControlIcon
                icon={<DiscardIcon size={18} />}
                label="Discard"
                ariaLabel="Discard and start again"
                onClick={onDiscard}
              />
            </motion.div>
          )}

          {phase === "paused" && (
            <motion.div
              key="paused-controls"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={pausedEntrance}
              className="flex items-center gap-400"
            >
              <ControlIcon
                icon={isReplaying ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
                label={isReplaying ? "Playing" : "Play"}
                ariaLabel={isReplaying ? "Playing back your recording" : "Play back your recording"}
                onClick={() => {
                  if (!isReplaying) setIsReplaying(true);
                }}
              />
              <ControlIcon
                icon={<MicIcon size={18} />}
                label="Resume"
                ariaLabel="Resume recording"
                onClick={() => {
                  setIsReplaying(false);
                  onResume();
                }}
              />
              <ControlIcon
                icon={<DiscardIcon size={18} />}
                label="Discard"
                ariaLabel="Discard and start again"
                onClick={() => {
                  setIsReplaying(false);
                  onDiscard();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

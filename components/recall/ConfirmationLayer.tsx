"use client";

import { motion } from "motion/react";
import { PrimaryButton } from "@/components/Buttons";
import { gentle } from "@/lib/motion";
import type { ConfirmationMode } from "@/lib/types";

/**
 * Pre-feedback confirmation — Transcript / Headline. Non-editable, single
 * "Continue" action. "None" mode never reaches this component (SPEC.md §5).
 */
export function ConfirmationLayer({
  mode,
  transcript,
  headline,
  onContinue,
}: {
  mode: Exclude<ConfirmationMode, "none">;
  transcript: string;
  headline: string;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={gentle}
      className="absolute inset-0 flex flex-col items-center justify-center gap-400 px-400 pt-200 pb-600"
    >
      {/* Same box for both modes — fixed size range so Transcript's longer
          text and Headline's one-liner feel like the same surface, not two
          different layouts. Long text scrolls inside the box instead of
          growing the page. Neutral surface + subtle border only — design
          tokens, not the textBox.svg artwork or any saturated accent. */}
      <div className="max-h-[280px] min-h-[160px] w-full overflow-y-auto rounded-800 border border-white/10 bg-surface px-400 py-400">
        <p className="text-body-m text-ink-primary">
          {mode === "transcript" ? `"${transcript}"` : headline}
        </p>
      </div>

      <PrimaryButton onClick={onContinue} className="w-full">
        Continue
      </PrimaryButton>
    </motion.div>
  );
}

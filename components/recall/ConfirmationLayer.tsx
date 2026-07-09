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
      transition={gentle}
      className="flex flex-1 flex-col gap-400 px-400 py-400"
    >
      <div className="rounded-800 bg-surface px-400 py-400 text-body-s text-ink-primary">
        {mode === "transcript" ? `"${transcript}"` : headline}
      </div>

      <div className="mt-auto">
        <PrimaryButton onClick={onContinue}>Continue</PrimaryButton>
      </div>
    </motion.div>
  );
}

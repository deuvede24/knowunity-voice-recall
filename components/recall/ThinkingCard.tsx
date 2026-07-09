"use client";

import { motion } from "motion/react";
import { gentle } from "@/lib/motion";

/**
 * Mocked "Knowie thinking" processing state, ~1–1.5s. The Knowie avatar
 * itself lives in the persistent ConceptHeader row (bob animation applied
 * there); this just supplies the "Let me think..." line, per the confirmed
 * resolution in SPEC.md §3/§12 (no eye-crossfade — the `questioning` asset
 * it would crossfade with doesn't exist in /public/images).
 */
export function ThinkingCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={gentle}
      className="flex flex-1 flex-col items-center justify-center"
    >
      <p className="text-body-m font-semibold text-ink-primary">Let me think...</p>
    </motion.div>
  );
}

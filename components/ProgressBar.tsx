"use client";

import { motion } from "motion/react";
import { gentle } from "@/lib/motion";

export function ProgressBar({ fraction }: { fraction: number }) {
  return (
    <div
      className="h-[3px] flex-1 overflow-hidden rounded-full bg-surface"
      role="progressbar"
      aria-valuenow={Math.round(fraction * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full rounded-full bg-purple-bold"
        initial={false}
        animate={{ width: `${Math.min(100, Math.max(0, fraction * 100))}%` }}
        transition={gentle}
      />
    </div>
  );
}

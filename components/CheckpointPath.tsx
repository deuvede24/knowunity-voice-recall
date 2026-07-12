"use client";

import { motion } from "motion/react";
import { ChecklistIcon } from "./icons";

export interface Checkpoint {
  label: string;
}

/** Horizontal drift (each way from center) between alternating checkpoints,
 * matching the zigzag rhythm in reference/checkpoints.svg (circle centers:
 * 165.5, 224.5, 165.5… — a 59px swing, split evenly so the path stays centered). */
const ZIGZAG_HALF = 29.5;

/**
 * Decorative checkpoint path below the Topic card — visual context only
 * (reference/checkpoints.svg), not a real interactive checkpoint system.
 * The first checkpoint reads as active (solid fill); the rest read as
 * upcoming (muted fill), matching the reference's active/upcoming states.
 *
 * `glowIndex` plays a single, non-looping attention pulse on one node (the
 * contextual Voice Recall invitation's "checkpoint just completed" cue) —
 * purely visual, no completion-state or persisted data changes.
 */
export function CheckpointPath({
  checkpoints,
  glowIndex,
}: {
  checkpoints: Checkpoint[];
  glowIndex?: number;
}) {
  return (
    <div className="flex flex-col items-center">
      {checkpoints.map((checkpoint, index) => {
        const isActive = index === 0;
        const isLast = index === checkpoints.length - 1;
        const offset = index % 2 === 1 ? ZIGZAG_HALF : -ZIGZAG_HALF;
        const nextOffset = index % 2 === 1 ? -ZIGZAG_HALF : ZIGZAG_HALF;

        return (
          <div key={checkpoint.label} className="flex flex-col items-center">
            <div
              className="flex flex-col items-center"
              style={{ transform: `translateX(${offset}px)` }}
            >
              <div className="relative flex h-[110px] w-[110px] items-center justify-center rounded-full border-8 border-white/10">
                {index === glowIndex && (
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -inset-3 rounded-full bg-pro-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.35, 0] }}
                    transition={{ duration: 0.6, delay: 0.15, ease: "easeInOut" }}
                  />
                )}
                <div
                  className={`flex h-[88px] w-[88px] items-center justify-center rounded-full ${
                    isActive ? "bg-pro-bold" : "bg-white/10"
                  }`}
                >
                  <ChecklistIcon
                    size={44}
                    className={isActive ? "text-ink-primary" : "text-pro-bold"}
                  />
                </div>
              </div>

              <p className="mt-200 w-[170px] text-center text-headline-s font-bold text-ink-primary">
                {checkpoint.label}
              </p>
            </div>

            {!isLast && (
              <div
                className="flex flex-col items-center gap-150 py-200"
                style={{ transform: `translateX(${(offset + nextOffset) / 2}px)` }}
              >
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="h-2 w-2 rounded-full bg-white/10"
                    style={{
                      transform: `translateX(${(dot - 1) * (nextOffset > offset ? 5 : -5)}px)`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

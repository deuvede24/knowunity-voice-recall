"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { sheet } from "@/lib/motion";

export function BottomSheet({
  open,
  onDismiss,
  children,
  surfaceClassName = "bg-surface",
  topOverlay,
}: {
  open: boolean;
  onDismiss: () => void;
  children: ReactNode;
  /** Sheet background — defaults to the standard surface token so every
   * existing caller (ModeSelector, etc.) is unaffected. Only pass a custom
   * value for a one-off treatment like KnowieInviteSheet's green surface. */
  surfaceClassName?: string;
  /** Optional content rendered behind the sheet, anchored to its top edge
   * and poking up above it (e.g. Knowie "peeking" over the sheet) — used
   * only by KnowieInviteSheet. Omitted by default, so every other sheet
   * renders exactly as before. */
  topOverlay?: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-20 flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-black/50"
            onClick={onDismiss}
            aria-hidden
          />
          {/* Shared positioning context for the optional top overlay: it sits
              behind the sheet (z-0) and is anchored to the sheet's own top
              edge, so the sheet's opaque background clips whatever portion
              of it dips below that edge — the "peeking from behind" look. */}
          <div className="relative z-10 w-full">
            {topOverlay && (
              <motion.div
                aria-hidden
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={sheet}
                className="pointer-events-none absolute inset-x-0 top-0 z-0 flex justify-center"
              >
                {topOverlay}
              </motion.div>
            )}
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={sheet}
              className={`relative z-10 w-full rounded-t-800 ${surfaceClassName} px-400 pb-600 pt-200`}
            >
              <div className="mx-auto mb-400 h-1 w-9 rounded-full bg-white/20" />
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

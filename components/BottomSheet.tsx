"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { sheet } from "@/lib/motion";

export function BottomSheet({
  open,
  onDismiss,
  children,
}: {
  open: boolean;
  onDismiss: () => void;
  children: ReactNode;
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
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={sheet}
            className="relative z-10 w-full rounded-t-800 bg-surface px-400 pb-600 pt-200"
          >
            <div className="mx-auto mb-400 h-1 w-9 rounded-full bg-white/20" />
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

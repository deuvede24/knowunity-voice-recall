"use client";

import { motion } from "motion/react";
import { BottomSheet } from "./BottomSheet";
import { Knowie } from "./Knowie";
import { PrimaryButton } from "./Buttons";
import { snappy } from "@/lib/motion";

/**
 * The contextual Voice Recall invitation — the first-time entry point into
 * Voice Active Recall, shown automatically after the checkpoint-completion
 * attention cue (see app/page.tsx). Reuses the shared BottomSheet; the
 * green surface and Knowie-peeking treatment are scoped to this sheet only
 * via BottomSheet's optional `surfaceClassName`/`topOverlay` props, so the
 * default BottomSheet look (ModeSelector, etc.) is unaffected.
 *
 * `isReturning` (true once the learner has completed onboarding before —
 * i.e. `hasSeenPermissionPrimer`) swaps in the lighter returning-user copy.
 * Layout, animation, and behavior are identical either way.
 */
export function KnowieInviteSheet({
  open,
  onDismiss,
  onAccept,
  isReturning = false,
}: {
  open: boolean;
  onDismiss: () => void;
  onAccept: () => void;
  isReturning?: boolean;
}) {
  return (
    <BottomSheet
      open={open}
      onDismiss={onDismiss}
      surfaceClassName="bg-success-onbold"
      topOverlay={<Knowie expression="approving" size="xl" className="translate-y-[-58%]" />}
    >
      {/* Extra top padding reserves room for Knowie peeking down from
          behind the sheet's top edge (see topOverlay above) so the title
          never sits under the mascot. */}
      <div className="flex flex-col items-center gap-300 pt-600 text-center">
        <h2 className="text-headline-s font-black text-ink-primary">
          {isReturning ? "This is a great moment for Voice Recall." : "You're doing great!"}
        </h2>
        <p className="text-body-m text-ink-primary">
          {isReturning
            ? "Reinforce what you've just learned."
            : "Let's reinforce what you've just learned with Voice Recall."}
        </p>
        <p className="text-body-s font-semibold text-ink-secondary">
          {isReturning ? "Want to try it now?" : "Want to explain it in your own words?"}
        </p>
        <div className="mt-200 flex w-full flex-col items-center gap-200">
          <PrimaryButton onClick={onAccept}>
            {isReturning ? "Let's do it" : "Let's try it"}
          </PrimaryButton>
          {/* Smaller, dimmer secondary CTA per ctaReference.svg (elevated
              white primary + translucent pill underneath) — a local
              treatment, not a change to the shared SecondaryButton/TextButton. */}
          <motion.button
            type="button"
            onClick={onDismiss}
            whileTap={{ scale: 0.96 }}
            transition={snappy}
            className="min-h-11 w-full rounded-full bg-white/10 px-400 py-300 text-body-s font-semibold text-ink-primary"
          >
            Not now
          </motion.button>
        </div>
      </div>
    </BottomSheet>
  );
}

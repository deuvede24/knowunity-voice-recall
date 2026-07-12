"use client";

import { motion } from "motion/react";
import { BottomSheet } from "./BottomSheet";
import { Knowie } from "./Knowie";
import { snappy } from "@/lib/motion";

// Local-only CTA treatment (per ctaReference.jpeg / public/images/ctaReference.svg):
// a taller pill with the documented "inset shadow 0 -2px/-4px rgba(0,0,0,0.15)
// on default" button-component shadow (design.md's Button component note),
// scoped entirely to this file — PrimaryButton/SecondaryButton stay untouched.
const CTA_SHADOW = "shadow-[inset_0_-4px_0_rgba(0,0,0,0.15)]";

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
        <p className="text-body-m font-semibold text-ink-primary">
          {isReturning
            ? "Reinforce what you've just learned."
            : "Let's reinforce what you've just learned with Voice Recall."}
        </p>
        <p className="text-body-m font-semibold text-ink-secondary">
          {isReturning ? "Want to try it now?" : "Want to explain it in your own words?"}
        </p>
        <div className="mt-200 flex w-full flex-col items-center gap-300">
          {/* Primary CTA — a local motion.button matching PrimaryButton's
              colors/architecture (not the shared component itself) so its
              size/shadow can be tuned here without touching every other
              PrimaryButton usage in the app. */}
          <motion.button
            type="button"
            onClick={onAccept}
            whileTap={{ scale: 0.96 }}
            transition={snappy}
            className={`min-h-12 w-full rounded-full bg-success-bold px-400 py-300 text-body-s font-semibold text-success-onbold ${CTA_SHADOW}`}
          >
            {isReturning ? "Let's do it" : "Let's try it"}
          </motion.button>
          {/* Secondary CTA — smaller/dimmer translucent pill per
              ctaReference.svg, with a hairline border instead of the
              primary's stronger shadow so it reads as clearly secondary. */}
          <motion.button
            type="button"
            onClick={onDismiss}
            whileTap={{ scale: 0.96 }}
            transition={snappy}
            className={`min-h-12 w-full rounded-full border border-white/10 bg-white/10 px-400 py-300 text-body-s font-semibold text-ink-primary ${CTA_SHADOW}`}
          >
            Not now
          </motion.button>
        </div>
      </div>
    </BottomSheet>
  );
}

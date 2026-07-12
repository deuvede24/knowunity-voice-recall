"use client";

import { motion } from "motion/react";
import { PrimaryButton } from "@/components/Buttons";
import { CheckIcon, TargetIcon, BubbleIcon } from "@/components/icons";
import { sheet } from "@/lib/motion";
import { COACHING_VISUALS, COACHING_CTA } from "@/lib/visuals";
import type { CoachingBand } from "@/lib/types";

// "Almost there" reuses the existing TargetIcon (bullseye/focus.svg) instead
// of the star — "focus here," tinted with the same pro/bold token as
// before via visuals.tintVar below, never its own hardcoded color.
const ICONS = { check: CheckIcon, sparkle: TargetIcon, bubble: BubbleIcon };

/**
 * Three-band coaching response — Got it / Almost there / Let's build on
 * that. Internal band names never render as student-facing labels
 * (sprint-context.md §16) — only the copy and CTA do. The Knowie avatar
 * lives in the persistent ConceptHeader row, not duplicated here, per
 * design.md's layout-consistency rule.
 *
 * Visually reuses BottomSheet's geometry (slide up from the bottom,
 * edge-to-edge width, rounded top corners, a soft top-edge elevation) so it
 * reads as the same "sheet" language as the rest of the app — but it is
 * NOT a modal: no backdrop, no scrim, no outside-tap dismissal, no focus
 * trap. Knowie and the conversational area above stay visible and
 * untouched the whole time.
 */
export function CoachingCard({
  band,
  title,
  body,
  onAction,
}: {
  band: CoachingBand;
  title: string;
  body: string;
  onAction: () => void;
}) {
  const visuals = COACHING_VISUALS[band];
  const Icon = ICONS[visuals.icon];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex justify-center">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={sheet}
        className="pointer-events-auto w-full max-w-[390px] rounded-t-800 px-400 pt-400 shadow-[0_-4px_16px_rgba(0,0,0,0.2)]"
        style={{
          backgroundColor: `color-mix(in srgb, ${visuals.tintVar} 24%, var(--color-app-bg))`,
          paddingBottom: "calc(env(safe-area-inset-bottom) + var(--space-400))",
        }}
      >
        <div className="flex flex-col gap-200">
          <div style={{ color: visuals.tintVar }}>
            <Icon size={18} />
          </div>
          <p className="text-body-m font-semibold text-ink-primary">{title}</p>
          <p className="text-body-s text-ink-secondary">{body}</p>
        </div>
        <PrimaryButton onClick={onAction} className="mt-300">
          {COACHING_CTA[band]}
        </PrimaryButton>
      </motion.div>
    </div>
  );
}

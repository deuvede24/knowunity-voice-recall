"use client";

import { motion } from "motion/react";
import { PrimaryButton } from "@/components/Buttons";
import { CheckIcon, SparkleIcon, BubbleIcon } from "@/components/icons";
import { gentle } from "@/lib/motion";
import { COACHING_VISUALS, COACHING_CTA } from "@/lib/visuals";
import type { CoachingBand } from "@/lib/types";

const ICONS = { check: CheckIcon, sparkle: SparkleIcon, bubble: BubbleIcon };

/**
 * Three-band coaching response — Got it / Almost there / Let's build on
 * that. Internal band names never render as student-facing labels
 * (sprint-context.md §16) — only the copy and CTA do. The Knowie avatar
 * lives in the persistent ConceptHeader row, not duplicated here, per
 * design.md's layout-consistency rule.
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
    <div className="flex flex-1 flex-col justify-center gap-400 px-400 py-400">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={gentle}
        className="flex flex-col gap-200 rounded-800 px-400 py-400"
        style={{ backgroundColor: `color-mix(in srgb, ${visuals.tintVar} 16%, transparent)` }}
      >
        <div style={{ color: visuals.tintVar }}>
          <Icon size={18} />
        </div>
        <p className="text-body-m font-semibold text-ink-primary">{title}</p>
        <p className="text-body-s text-ink-secondary">{body}</p>
      </motion.div>
      <PrimaryButton onClick={onAction}>{COACHING_CTA[band]}</PrimaryButton>
    </div>
  );
}

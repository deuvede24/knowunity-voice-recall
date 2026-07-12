"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Knowie } from "@/components/Knowie";
import { BulbIcon } from "@/components/icons";
import type { Expression } from "@/lib/types";
import { soft } from "@/lib/motion";

// Reminder bubble indent — aligns it under the main bubble (not under
// Knowie): Knowie's own width (112px, "headerLg") + the row's gap-300 (12px).
const REMINDER_INDENT = 124;
const REMINDER_TINT = "color-mix(in srgb, var(--color-purple-bold) 18%, var(--color-app-bg))";

/** The speech-bubble tail — per reference/knowieSpeaks2.jpeg exactly: a
 * small triangular flick (curved on top, flat on the bottom) growing out of
 * the bubble's bottom-left corner, not vertically centered. No border of
 * its own — the reference bubble itself has no stroke at all, which is
 * exactly what makes the tail read as part of the same continuous shape
 * instead of a separate piece glued onto a bordered box. Rendered as a
 * sibling *behind* the bubble's own background (see usage below) so a few
 * pixels of its right side tuck under the bubble. */
function BubbleTail({ fill, size = "md" }: { fill: string; size?: "md" | "sm" }) {
  const px = size === "sm" ? { width: 12, height: 12, overlap: 4, bottom: 6 } : { width: 15, height: 15, overlap: 5, bottom: 10 };
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      style={{ width: px.width, height: px.height, right: `calc(100% - ${px.overlap}px)`, bottom: px.bottom }}
      className="absolute"
    >
      <path d="M20 4C10 10 2 14 0 20L20 20Z" fill={fill} />
    </svg>
  );
}

/**
 * The one persistent Knowie + speech-bubble row. Per design.md's "Layout
 * consistency": Knowie and the conversational area stay fixed in the same
 * slot from the first concept until the summary — only the expression and
 * bubble content change (recording prompt, thinking, milestone, coaching
 * expression). One conversational bubble language, per
 * reference/knowieSpeaks2.jpeg exactly — a soft rounded rectangle (no
 * border/stroke: a border was what made the tail read as a separate piece
 * glued onto the box in an earlier pass) at the "Type instead" field's
 * height/padding proportions, with its own corner radius (28px — the
 * field's literal 32px reads as a pill on our much shorter bubble) and a
 * small tail growing out of its bottom-left corner — is reused for all of
 * it. Callers compose their own typography hierarchy inside `primaryText`.
 * A smaller secondary bubble underneath, in the same language, carries the
 * retry hint — Knowie quietly adding an idea, not a warning.
 */
export function ConceptHeader({
  primaryText,
  expression,
  animateBob = false,
  animateBounce = false,
  reminder,
}: {
  primaryText: ReactNode;
  expression: Expression;
  animateBob?: boolean;
  animateBounce?: boolean;
  reminder?: string;
}) {
  return (
    <div className="flex flex-col gap-200 px-400 pt-400">
      <div className="flex items-center gap-300">
        <Knowie
          expression={expression}
          size="headerLg"
          animateBob={animateBob}
          animateBounce={animateBounce}
        />
        <div className="relative flex-1">
          {/* Tail first (behind), the bubble box second (in front) — both
              positioned, so the bubble's own opaque background covers the
              part of the tail that tucks underneath it. */}
          <BubbleTail fill="var(--color-surface)" />
          <div className="relative rounded-[28px] bg-surface px-400 py-300">
            <div className="flex flex-col gap-050">{primaryText}</div>
          </div>
        </div>
      </div>
      {/* Reminder hint — a smaller secondary speech bubble in the SAME soft
          conversational language as the main bubble above (same generous
          radius, scaled down slightly for its smaller size, and the same
          tail-grows-out-of-the-bubble treatment), just at ~65% width and
          tinted lilac (textBox.svg / ideaReminder.svg) instead of the
          neutral surface color — reads as Knowie quietly following up, not
          a second card. Never coral/amber — those are reserved for
          coaching states. */}
      <AnimatePresence>
        {reminder && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={soft}
            style={{ marginLeft: REMINDER_INDENT }}
            className="relative w-[65%]"
          >
            <BubbleTail fill={REMINDER_TINT} size="sm" />
            <div
              style={{ backgroundColor: REMINDER_TINT }}
              className="relative flex items-start gap-150 rounded-[24px] px-300 py-200"
            >
              <span className="mt-050 shrink-0 text-purple-bold">
                <BulbIcon size={16} />
              </span>
              <p className="text-caption-m font-semibold text-ink-primary">
                {reminder.replace(/^Reminder:\s*/i, "")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

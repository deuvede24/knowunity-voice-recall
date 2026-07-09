import type { ReactNode } from "react";
import { Knowie } from "@/components/Knowie";
import type { Expression } from "@/lib/types";

/**
 * The one persistent Knowie + status-line row. Per design.md's "Layout
 * consistency": Knowie and the concept stay fixed in the same slot from the
 * first concept until the summary — only the expression and line of text
 * change (recording prompt, confirmation label, thinking, coaching).
 */
export function ConceptHeader({
  primaryText,
  expression,
  animateBob = false,
  reminder,
}: {
  primaryText: ReactNode;
  expression: Expression;
  animateBob?: boolean;
  reminder?: string;
}) {
  return (
    <div className="flex flex-col gap-200 px-400 pt-400">
      <div className="flex items-center gap-300">
        <Knowie expression={expression} size="md" animateBob={animateBob} />
        <div className="flex-1 rounded-800 bg-surface px-400 py-300">
          <p className="text-body-m text-ink-primary">{primaryText}</p>
        </div>
      </div>
      {/* Reserved height regardless of whether the reminder is shown, so
          entering/leaving retry doesn't shift the layout below (task: no
          jump when pressing the coaching CTA into a retry). */}
      <div className="min-h-[16px] px-100">
        {reminder && (
          <p className="text-caption-m font-semibold text-coral-bold">{reminder}</p>
        )}
      </div>
    </div>
  );
}

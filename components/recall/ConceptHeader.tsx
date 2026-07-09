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
      <div className="flex items-center gap-200">
        <Knowie expression={expression} size="sm" animateBob={animateBob} />
        <p className="text-body-s text-ink-secondary">{primaryText}</p>
      </div>
      {reminder && (
        <p className="text-caption-m font-semibold text-coral-bold">{reminder}</p>
      )}
    </div>
  );
}

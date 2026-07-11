"use client";

import type { ConfirmationMode } from "@/lib/types";

/**
 * The neutral Transcript/Headline card — informational only, never editable.
 * Lives inside the recall composer's Review step (RecordingArea), filling
 * whatever height its flex parent gives it; long text scrolls internally
 * instead of growing the card. "None" mode never reaches this component
 * (SPEC.md §5).
 */
export function ConfirmationLayer({
  mode,
  transcript,
  headline,
}: {
  mode: Exclude<ConfirmationMode, "none">;
  transcript: string;
  headline: string;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto rounded-800 border border-white/10 bg-surface px-400 py-400">
      <p className="text-body-m text-ink-primary">
        {mode === "transcript" ? `"${transcript}"` : headline}
      </p>
    </div>
  );
}

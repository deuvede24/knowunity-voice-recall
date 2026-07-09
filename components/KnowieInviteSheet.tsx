"use client";

import { BottomSheet } from "./BottomSheet";
import { Knowie } from "./Knowie";
import { PrimaryButton, TextButton } from "./Buttons";

/**
 * Entry B — the contextual Knowie invitation. Not wired into the visible
 * Topic screen flow as of this pass (SPEC.md §8); kept unwired for a
 * possible future entry point. No real struggle-detection logic is
 * simulated.
 */
export function KnowieInviteSheet({
  open,
  onDismiss,
  onAccept,
}: {
  open: boolean;
  onDismiss: () => void;
  onAccept: () => void;
}) {
  return (
    <BottomSheet open={open} onDismiss={onDismiss}>
      <div className="flex flex-col items-center gap-300 text-center">
        <Knowie expression="approving" size="sm" />
        <p className="text-caption-m font-semibold uppercase tracking-wide text-ink-secondary">
          Fix Mistakes · 2nd miss
        </p>
        <p className="text-body-m text-ink-primary">You&apos;ve missed &quot;hiragana&quot; twice</p>
        <p className="text-headline-s font-bold text-ink-primary">
          Want to explain it back to me?
        </p>
        <div className="mt-200 flex w-full flex-col gap-200">
          <PrimaryButton onClick={onAccept}>Yes, let&apos;s try</PrimaryButton>
          <TextButton onClick={onDismiss}>Not now</TextButton>
        </div>
      </div>
    </BottomSheet>
  );
}

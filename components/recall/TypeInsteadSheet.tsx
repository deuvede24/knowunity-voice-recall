"use client";

import { useEffect, useState } from "react";
import { BottomSheet } from "@/components/BottomSheet";
import { PrimaryButton } from "@/components/Buttons";

/**
 * Can't-speak text fallback. Equal dignity with voice: same prompt, same
 * confirmation/coaching path, reachable in one tap, no repeated permission
 * primer (sprint-context.md §14). Presented as a bottom sheet per
 * motion-guide.md's explicit recipe for this fallback.
 */
export function TypeInsteadSheet({
  open,
  term,
  initialValue,
  onDismiss,
  onSend,
}: {
  open: boolean;
  term: string;
  initialValue: string;
  onDismiss: () => void;
  onSend: (text: string) => void;
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (open) setValue(initialValue);
  }, [open, initialValue]);

  function handleSend() {
    if (!value.trim()) return;
    onSend(value.trim());
  }

  return (
    <BottomSheet open={open} onDismiss={onDismiss}>
      <div className="flex flex-col gap-300">
        <p className="text-body-s text-ink-secondary">
          Explain in your own words: <span className="font-semibold text-ink-primary">{term}</span>
        </p>
        <textarea
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your answer..."
          rows={5}
          className="w-full resize-none rounded-800 bg-app-bg px-400 py-300 text-body-s text-ink-primary outline-none placeholder:text-ink-disabled"
        />
        <PrimaryButton onClick={handleSend} disabled={!value.trim()}>
          Send
        </PrimaryButton>
      </div>
    </BottomSheet>
  );
}

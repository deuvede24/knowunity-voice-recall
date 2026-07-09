"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/BottomSheet";
import { PrimaryButton } from "@/components/Buttons";
import { ChevronDownIcon } from "@/components/icons";
import type { ConfirmationMode } from "@/lib/types";

const MODE_LABEL: Record<ConfirmationMode, string> = {
  transcript: "Transcript",
  headline: "Headline",
  none: "None",
};

const MODE_OPTIONS: {
  mode: ConfirmationMode;
  title: string;
  description: string;
}[] = [
  {
    mode: "transcript",
    title: "Transcript — what Knowie heard",
    description: "Full text of what Knowie heard, before coaching.",
  },
  {
    mode: "headline",
    title: "Headline — short summary",
    description: "One line summarising what you explained.",
  },
  {
    mode: "none",
    title: "None — go straight to coaching",
    description: "No confirmation layer. Send goes straight to Thinking.",
  },
];

export function ModeSelector({
  mode,
  onChange,
  showDiscoveryDot,
  onOpened,
}: {
  mode: ConfirmationMode;
  onChange: (mode: ConfirmationMode) => void;
  showDiscoveryDot: boolean;
  onOpened: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ConfirmationMode>(mode);

  function openSheet() {
    setDraft(mode);
    setOpen(true);
    // The discovery dot disappears the moment the selector is opened,
    // whether or not the mode is changed (sprint-context.md §12).
    onOpened();
  }

  function save() {
    onChange(draft);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={openSheet}
        className="relative flex shrink-0 items-center gap-100 whitespace-nowrap rounded-full bg-surface px-200 py-150 text-caption-m font-semibold text-ink-secondary"
      >
        {MODE_LABEL[mode]}
        <ChevronDownIcon size={14} />
        {showDiscoveryDot && (
          <span
            aria-hidden
            className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-purple-bold"
          />
        )}
      </button>

      <BottomSheet open={open} onDismiss={() => setOpen(false)}>
        <h2 className="mb-400 text-body-m font-semibold text-ink-primary">
          Review before feedback
        </h2>
        <div className="flex flex-col gap-300">
          {MODE_OPTIONS.map((option) => (
            <label
              key={option.mode}
              className="flex cursor-pointer items-start justify-between gap-300 rounded-800 bg-app-bg px-300 py-300"
            >
              <span className="flex flex-col gap-050">
                <span className="text-body-s font-semibold text-ink-primary">
                  {option.title}
                </span>
                <span className="text-caption-m text-ink-secondary">
                  {option.description}
                </span>
              </span>
              <input
                type="radio"
                name="confirmation-mode"
                value={option.mode}
                checked={draft === option.mode}
                onChange={() => setDraft(option.mode)}
                className="mt-050 h-4 w-4 shrink-0 accent-purple-bold"
              />
            </label>
          ))}
        </div>
        <div className="mt-400">
          <PrimaryButton onClick={save}>Save</PrimaryButton>
        </div>
      </BottomSheet>
    </>
  );
}

"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { TextButton } from "@/components/Buttons";
import { SendIcon } from "@/components/icons";
import { gentle, snappy } from "@/lib/motion";

/**
 * Can't-speak text fallback. Equal dignity with voice: same prompt, same
 * confirmation/coaching path, reachable in one tap, no repeated permission
 * primer (sprint-context.md §14). Rendered inline as its own slot alongside
 * the other recall stages (not a bottom sheet/modal) — it's the voice
 * composer switching to a native text composer, not a separate screen.
 * Bottom-anchored so the writing surface sits just above the mobile
 * keyboard once it opens, like a chat composer.
 */
export function TypeInsteadSheet({
  initialValue,
  onDismiss,
  onSend,
}: {
  initialValue: string;
  onDismiss: () => void;
  onSend: (text: string) => void;
}) {
  const [value, setValue] = useState(initialValue);

  function handleSend() {
    if (!value.trim()) return;
    onSend(value.trim());
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={gentle}
      className="absolute inset-0 flex flex-col justify-end gap-300 px-400 pb-400"
    >
      <TextButton onClick={onDismiss} className="self-center underline">
        Voice instead
      </TextButton>

      {/* Same rounded-surface language as the Transcript/Headline card
          (radius-800, bg-surface, subtle border) — this is a native text
          input, not a card, so no quoted-text/label chrome on top of it. */}
      <div className="relative w-full rounded-800 border border-white/10 bg-surface">
        <textarea
          autoFocus
          spellCheck={false}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your answer..."
          rows={4}
          className="w-full resize-none rounded-800 bg-transparent py-300 pl-400 pr-[52px] text-body-s text-ink-primary outline-none placeholder:text-ink-disabled"
        />
        <motion.button
          type="button"
          onClick={handleSend}
          disabled={!value.trim()}
          whileTap={{ scale: 0.92 }}
          transition={snappy}
          aria-label="Send answer"
          className="absolute bottom-200 right-200 flex h-9 w-9 items-center justify-center rounded-full bg-interactive-primary text-interactive-onprimary disabled:opacity-40"
        >
          <SendIcon size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}

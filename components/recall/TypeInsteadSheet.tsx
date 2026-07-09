"use client";

import { useEffect, useRef, useState } from "react";
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
  const [keyboardInset, setKeyboardInset] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function placeCaretAtEnd(el: HTMLTextAreaElement) {
    const end = el.value.length;
    el.setSelectionRange(end, end);
  }

  // autoFocus alone can leave the caret (or a full selection) at the start
  // of the pre-filled transcript; put it at the end instead, like resuming
  // a draft rather than starting from scratch. Set on both mount AND the
  // real focus event — on mobile, autofocus-on-mount doesn't always land
  // reliably, so the mount-time attempt alone isn't enough.
  useEffect(() => {
    const el = textareaRef.current;
    if (el) placeCaretAtEnd(el);
  }, []);

  // iOS Safari doesn't shrink `dvh` for the software keyboard (only for
  // browser-chrome show/hide), so a pure-CSS `pb-*` gap ends up measured
  // against a viewport that doesn't actually reflect the keyboard — the
  // native scroll-into-view then lands the field flush against it. Track
  // the real keyboard height via visualViewport and add it as extra bottom
  // padding so the gap holds regardless of that dvh limitation.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    function updateInset() {
      const inset = Math.max(0, window.innerHeight - vv!.height - vv!.offsetTop);
      setKeyboardInset(inset);
    }
    updateInset();
    vv.addEventListener("resize", updateInset);
    vv.addEventListener("scroll", updateInset);
    return () => {
      vv.removeEventListener("resize", updateInset);
      vv.removeEventListener("scroll", updateInset);
    };
  }, []);

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
      className="absolute inset-0 flex flex-col justify-end gap-300 px-400 pb-600"
      style={keyboardInset > 0 ? { paddingBottom: keyboardInset + 24 } : undefined}
    >
      <TextButton onClick={onDismiss} className="self-center underline">
        Voice instead
      </TextButton>

      {/* Same rounded-surface language as the Transcript/Headline card
          (radius-800, bg-surface, subtle border) — this is a native text
          input, not a card, so no quoted-text/label chrome on top of it. */}
      <div className="relative w-full rounded-800 border border-white/10 bg-surface">
        <textarea
          ref={textareaRef}
          autoFocus
          spellCheck={false}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={(e) => placeCaretAtEnd(e.currentTarget)}
          placeholder="Type your answer..."
          rows={4}
          className="w-full resize-none rounded-800 bg-transparent py-300 pl-400 pr-[60px] text-body-s text-ink-primary outline-none placeholder:text-ink-disabled"
        />
        <motion.button
          type="button"
          onClick={handleSend}
          disabled={!value.trim()}
          whileTap={{ scale: 0.92 }}
          transition={snappy}
          aria-label="Send answer"
          className="absolute bottom-400 right-400 flex h-9 w-9 items-center justify-center rounded-full bg-interactive-primary text-interactive-onprimary disabled:opacity-40"
        >
          <SendIcon size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}

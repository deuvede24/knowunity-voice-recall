"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { PhoneShell } from "@/components/PhoneShell";
import { TopicTopBar } from "@/components/TopBar";
import { BookIcon } from "@/components/icons";
import { MicIcon } from "@/components/MicIcon";
import { CheckpointPath } from "@/components/CheckpointPath";
import { BottomNav } from "@/components/BottomNav";
import { KnowieInviteSheet } from "@/components/KnowieInviteSheet";
import {
  getHasSeenEntryMicDot,
  setHasSeenEntryMicDot,
  getHasSeenPermissionPrimer,
} from "@/lib/storage";

const CHECKPOINTS = [
  { label: "Writing Fundamentals" },
  { label: "Reading & Recognition" },
  { label: "Practice & Review" },
];

// Total time for the contextual attention cue to finish before the
// invitation opens — mocked timing, same pattern already used for the
// Thinking -> Coaching delay in RecallFlow. First-time path only for this
// pass: it always plays on load, no persistence/returning-user check yet
// (see PROGRESS.md).
//
// The checkpoint glow (CheckpointPath: 0.15s delay + 0.6s = finishes 0.75s)
// and this mic-dot pulse (starts 0.35s, finishes 0.85s) deliberately overlap
// for ~0.4s so the two cues read as one gesture rather than two separate
// beats; the sheet opens right as the later one (the pulse) finishes.
const ATTENTION_CUE_MS = 900;

export default function TopicScreen() {
  const router = useRouter();
  const [showMicDot, setShowMicDot] = useState(() => !getHasSeenEntryMicDot());
  const [showInvite, setShowInvite] = useState(false);
  // Onboarding already completed once -> the invitation uses the lighter
  // returning-user copy (same flag PermissionPrimer itself is gated on).
  const [isReturning] = useState(() => getHasSeenPermissionPrimer());

  useEffect(() => {
    const t = setTimeout(() => setShowInvite(true), ATTENTION_CUE_MS);
    return () => clearTimeout(t);
  }, []);

  function enterRecall() {
     if (showMicDot) {
    setHasSeenEntryMicDot();
    setShowMicDot(false);
  }

    router.push("/recall");
  }

  return (
    <PhoneShell>
      <TopicTopBar />

      <main className="flex flex-1 flex-col gap-600 px-400 pt-400 pb-600">
        <header className="flex flex-col gap-100">
          <h1 className="text-center text-headline-xl font-black text-ink-primary">Japanese</h1>
          <p className="text-center text-caption-m text-ink-secondary">
            Due in 1 day · Grade goal 2
          </p>
        </header>

        <div className="flex items-center justify-between gap-300 rounded-800 bg-surface px-400 py-300">
          <div className="flex items-center gap-300"> 
            <span className="text-body-m font-semibold text-ink-primary">
              Japanese Writing System
            </span>
            <BookIcon size={20} className="shrink-0 text-purple-bold" />
          </div>
          {/* Plain button + CSS active state, not motion.button/whileTap: on a
              real phone (tested over the LAN IP, not desktop localhost)
              Motion's pointer-event-driven tap gesture was swallowing the
              tap before the native click could fire. A native button with a
              CSS :active transform doesn't intercept the touch sequence. */}
          <button
            type="button"
            onClick={enterRecall}
            aria-label="Practise Voice Recall for this topic"
            className="relative flex h-11 w-11 shrink-0 items-center justify-center text-purple-bold transition-transform duration-100 active:scale-90"
          >
            <MicIcon size={24} />
            {showMicDot && (
              <motion.span
                aria-hidden
                className="absolute right-1 top-1 h-2 w-2 rounded-full bg-purple-bold"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.7, 1] }}
                transition={{ duration: 0.5, delay: 0.35, ease: "easeInOut" }}
              />
            )}
          </button>
        </div>

        <CheckpointPath checkpoints={CHECKPOINTS} glowIndex={0} />
      </main>

      <BottomNav />

      <KnowieInviteSheet
        open={showInvite}
        onDismiss={() => setShowInvite(false)}
        onAccept={enterRecall}
        isReturning={isReturning}
      />
    </PhoneShell>
  );
}

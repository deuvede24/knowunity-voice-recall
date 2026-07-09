"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneShell } from "@/components/PhoneShell";
import { TopicTopBar } from "@/components/TopBar";
import { BookIcon } from "@/components/icons";
import { MicIcon } from "@/components/MicIcon";
import { CheckpointPath } from "@/components/CheckpointPath";
import { BottomNav } from "@/components/BottomNav";
import { getHasSeenEntryMicDot, setHasSeenEntryMicDot } from "@/lib/storage";

const CHECKPOINTS = [
  { label: "Writing Fundamentals" },
  { label: "Reading & Recognition" },
  { label: "Practice & Review" },
];

export default function TopicScreen() {
  const router = useRouter();
  const [showMicDot, setShowMicDot] = useState(() => !getHasSeenEntryMicDot());

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
              <span
                aria-hidden
                className="absolute right-1 top-1 h-2 w-2 rounded-full bg-purple-bold"
              />
            )}
          </button>
        </div>

        <CheckpointPath checkpoints={CHECKPOINTS} />
      </main>

      <BottomNav />
    </PhoneShell>
  );
}

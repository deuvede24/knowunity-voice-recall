"use client";

import { motion } from "motion/react";
import { Knowie } from "@/components/Knowie";
import { PrimaryButton } from "@/components/Buttons";
import { CheckIcon } from "@/components/icons";
import type { Concept, ConceptOutcomeStatus } from "@/lib/types";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};
const SUMMARY_LABELS: Record<string, string> = {
  hiragana: "grammar → verb endings",
  katakana: "foreign words → emphasis",
  furigana: "Still practising: reading kanji",
  "three-writing-systems": "grammar + loanwords + meaning",
};

export function SummaryScreen({
  concepts,
  outcomes,
  onContinue,
}: {
  concepts: Concept[];
  outcomes: Record<string, ConceptOutcomeStatus>;
  onContinue: () => void;
}) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-1 flex-col items-center gap-400 px-400 py-600 text-center"
    >
      <motion.div variants={item}>
        <Knowie expression="excited" size="lg" />
      </motion.div>
      <motion.h1 variants={item} className="text-headline-s font-bold text-ink-primary">
        You explained more than you thought you could.
      </motion.h1>

      <motion.div variants={item} className="flex w-full flex-col gap-200">
        {concepts.map((concept) => {
          const status = outcomes[concept.id] ?? "pending";
          const gotIt = status === "gotIt";
          return (
            <div
              key={concept.id}
              className="flex items-center gap-200 rounded-800 bg-surface px-400 py-300 text-left"
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                style={{
                  color: gotIt ? "var(--color-success-bold)" : "var(--color-coral-bold)",
                }}
              >
                {gotIt ? <CheckIcon size={16} /> : <span className="text-caption-m">○</span>}
              </span>
              <span className="text-body-s font-semibold text-ink-primary">
                {concept.term}
              </span>
              <span className="ml-auto text-caption-m text-ink-secondary">
                {SUMMARY_LABELS[concept.id]}
              </span>
            </div>
          );
        })}
      </motion.div>

      <motion.p variants={item} className="text-body-s text-ink-secondary">
        These should feel easier to recall next time — because you explained
        them yourself.
      </motion.p>

      <motion.div variants={item} className="mt-auto w-full">
        <PrimaryButton onClick={onContinue}>Let&apos;s keep going</PrimaryButton>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { motion } from "motion/react";
import { Knowie } from "./Knowie";
import { PrimaryButton, TextButton } from "./Buttons";
import { gentle } from "@/lib/motion";

/**
 * First-time mic permission primer — SPEC.md §7. Mocked: "Allow microphone"
 * always succeeds, no real OS permission call. Shown once per browser.
 */
export function PermissionPrimer({
  onAllow,
  onTypeInstead,
}: {
  onAllow: () => void;
  onTypeInstead: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={gentle}
      className="flex flex-1 flex-col items-center justify-center px-400 text-center"
    >
      <Knowie expression="micro" size="lg" className="mb-400" />

      <h1 className="max-w-70 text-headline-s font-black leading-6 text-ink-primary">
        Welcome to Voice Active Recall
      </h1>

      <p className="mt-200 text-body-m font-semibold text-ink-primary">
        Say it out loud. Know it for real.
      </p>

      <div className="mt-400 flex flex-col gap-200">
        <p className="text-body-s text-ink-secondary">
          Voice Recall uses your microphone so you can explain concepts out loud
          in your own words.
        </p>

        <p className="text-body-s text-ink-secondary">
          We need microphone access to get started.
        </p>

        <p className="text-body-s text-ink-secondary">
          Knowie will show you a transcript first. You can change this later.
        </p>
      </div>

      <div className="mt-600 flex w-full flex-col items-center gap-300">
        <PrimaryButton onClick={onAllow}>
          Allow microphone
        </PrimaryButton>

        <TextButton onClick={onTypeInstead}>
          Type instead
        </TextButton>
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "motion/react";
import type { ButtonHTMLAttributes } from "react";
import { snappy } from "@/lib/motion";

type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDrag" | "onDragStart" | "onDragEnd"
>;

/** Pill primary button — interactive/primary bg, onprimary text (design.md). */
export function PrimaryButton({ className = "", ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={snappy}
      className={`min-h-11 w-full rounded-full bg-interactive-primary px-400 py-300 text-body-s font-semibold text-interactive-onprimary disabled:opacity-40 ${className}`}
      {...props}
    />
  );
}

/** Secondary pill button — surface bg, primary text. */
export function SecondaryButton({ className = "", ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={snappy}
      className={`min-h-11 rounded-full bg-surface px-400 py-300 text-body-s font-semibold text-ink-primary disabled:opacity-40 ${className}`}
      {...props}
    />
  );
}

/** Tertiary text-only action — e.g. "Not now", "Cancel", "Skip for now". */
export function TextButton({ className = "", ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={snappy}
      className={`min-h-11 whitespace-nowrap px-150 text-body-s font-semibold text-ink-secondary underline-offset-2 hover:underline ${className}`}
      {...props}
    />
  );
}

/**
 * Round icon-only button — e.g. exit X, pause, discard, send.
 * `size="lg"` (56px) is for controls that need a roomier tap target (e.g.
 * the recall composer's Review actions); `"xl"` (60px) is the same idea
 * sized up slightly further (the recall composer's Recording/Paused
 * controls); default `"md"` (44px, the spec minimum) is unchanged for every
 * other existing usage.
 */
export function IconButton({
  className = "",
  size = "md",
  ...props
}: ButtonProps & { size?: "md" | "lg" | "xl" }) {
  const sizeClass = size === "xl" ? "h-[60px] w-[60px]" : size === "lg" ? "h-14 w-14" : "h-11 w-11";
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      transition={snappy}
      className={`flex items-center justify-center rounded-full ${sizeClass} ${className}`}
      {...props}
    />
  );
}

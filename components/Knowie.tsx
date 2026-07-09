"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Expression } from "@/lib/types";
import { EXPRESSION_IMAGE, EXPRESSION_ALT } from "@/lib/visuals";

const SIZES = {
  sm: 56,
  md: 96,
  lg: 160,
  xl: 220,
} as const;

interface KnowieProps {
  expression: Expression;
  size?: keyof typeof SIZES;
  /** Gentle bob loop, used for the "thinking" processing state. */
  animateBob?: boolean;
  className?: string;
}

export function Knowie({
  expression,
  size = "md",
  animateBob = false,
  className,
}: KnowieProps) {
  const px = SIZES[size];
  const reduceMotion = useReducedMotion();
  const bob = animateBob && !reduceMotion;
  return (
    <motion.div
      className={`shrink-0 ${className ?? ""}`}
      style={{ width: px, height: px }}
      animate={bob ? { rotate: [-3, 3, -3], y: [0, -4, 0] } : { rotate: 0, y: 0 }}
      transition={
        bob ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- local SVG mascot art, no optimization needed */}
      <img
        src={EXPRESSION_IMAGE[expression]}
        alt={EXPRESSION_ALT[expression]}
        width={px}
        height={px}
        className="h-full w-full object-contain"
      />
    </motion.div>
  );
}

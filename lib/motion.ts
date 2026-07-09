// Shared Motion presets — reuse these, don't invent new ones (motion-guide.md).
import type { Transition } from "motion/react";

export const gentle: Transition = { type: "spring", stiffness: 260, damping: 30 }; // most UI
export const snappy: Transition = { type: "spring", stiffness: 400, damping: 28 }; // taps, toggles
export const sheet: Transition = { type: "spring", stiffness: 300, damping: 34 }; // bottom sheets
export const soft: Transition = { duration: 0.22, ease: [0.22, 1, 0.36, 1] }; // fades, simple moves

import type { CoachingBand, Expression } from "./types";

// Mascot expression → asset file, from /public/images (design.md Homie Cards).
export const EXPRESSION_IMAGE: Record<Expression, string> = {
  standby: "/images/mascotStandBy.svg",
  approving: "/images/mascotApproving.svg",
  excited: "/images/mascotExcited.svg",
  thinking: "/images/thinkingMascot.svg",
  dazed: "/images/dazedMascot.svg",
  confused: "/images/confused.svg",
  determined: "/images/determinedMascot.svg",
  giggling: "/images/gigglingMascot.svg",
  laughing: "/images/masctoLaughing.svg",
  amazed: "/images/mascotAmazed.svg",
  micro: "/images/knowiePermission.svg",
};

export const EXPRESSION_ALT: Record<Expression, string> = {
  standby: "Knowie, neutral and listening",
  approving: "Knowie, encouraging",
  excited: "Knowie, delighted",
  thinking: "Knowie, thinking",
  dazed: "Knowie, gently puzzled",
  confused: "Knowie, uncertain",
  determined: "Knowie, focused",
  giggling: "Knowie, warmly amused",
  laughing: "Knowie, playful",
  amazed: "Knowie, impressed",
  micro: "Knowie, asking for microphone permission",
};

// Coaching band → card tint / icon — SPEC.md §10.
export const COACHING_VISUALS: Record<
  CoachingBand,
  { tintVar: string; label: string; icon: "check" | "sparkle" | "bubble" }
> = {
  gotIt: { tintVar: "var(--color-success-bold)", label: "Got it", icon: "check" },
  almostThere: {
    tintVar: "var(--color-pro-bold)",
    label: "Almost there",
    icon: "sparkle",
  },
  letsBuildOnThat: {
    tintVar: "var(--color-coral-bold)",
    label: "Let's build on that",
    icon: "bubble",
  },
};

export const COACHING_CTA: Record<CoachingBand, string> = {
  gotIt: "Continue",
  almostThere: "Try again",
  letsBuildOnThat: "Try again",
};

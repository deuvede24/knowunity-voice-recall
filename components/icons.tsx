// Generic UI chrome glyphs. Not brand/mascot assets — simple universal
// iconography (close, menu, book, etc.), styled with design.md's ink/icon
// tokens rather than any invented visual system.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function MoreIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={0} fill="currentColor">
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 5.5c0-.83.67-1.5 1.5-1.5H11v14H5.5A1.5 1.5 0 0 0 4 19.5v-14Z" />
      <path d="M20 5.5c0-.83-.67-1.5-1.5-1.5H13v14h5.5c.83 0 1.5.67 1.5 1.5v-14Z" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 13l4.5 4.5L19 7" />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={0} fill="currentColor">
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" />
    </svg>
  );
}

export function BubbleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H10l-4 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-7Z" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={0} fill="currentColor">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={0} fill="currentColor">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

export function DiscardIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 7h14M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M18 7l-.8 12.1A2 2 0 0 1 15.2 21H8.8a2 2 0 0 1-2-1.9L6 7" />
    </svg>
  );
}

/** Paper-plane send glyph — matches /public/images/sendT.svg's silhouette. */
export function SendIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21 3 3 10.5l7.5 3L21 3Z" />
      <path d="M21 3 13.5 20.5l-3-7L21 3Z" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/** Checkpoint node glyph — document with a question mark (reference/checkpoints.svg). */
export function ChecklistIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 4.5A1.5 1.5 0 0 1 8.5 3h5.379a1.5 1.5 0 0 1 1.06.44l2.622 2.62a1.5 1.5 0 0 1 .439 1.061V19.5a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 7 19.5v-15Z" />
      <path d="M9.8 8h4.4M9.8 11h2.6" />
      <path d="M12.3 15.2a1.2 1.2 0 1 1 1.55 1.148c-.383.116-.75.397-.75.902v.15" />
      <path d="M13.1 19.05h.02" strokeWidth={2.4} />
    </svg>
  );
}

/** Bottom-nav glyphs — generic chrome, same bucket as the icons above. */
export function HomeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v8.5A1.5 1.5 0 0 0 7.5 20h9a1.5 1.5 0 0 0 1.5-1.5V10" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.35-4.35" />
    </svg>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}

export function ProfileIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c0-3.6 3.13-6.5 7-6.5s7 2.9 7 6.5" />
    </svg>
  );
}

// Phone-chrome glyphs (status bar) — generic OS iconography, same bucket as
// the close/menu/book glyphs above, not a brand/mascot asset.
export function SignalIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={0} fill="currentColor">
      <rect x="2" y="14" width="4" height="6" rx="1" />
      <rect x="8" y="10" width="4" height="10" rx="1" />
      <rect x="14" y="6" width="4" height="14" rx="1" />
      <rect x="20" y="2" width="2.5" height="18" rx="1" />
    </svg>
  );
}

export function WifiIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 9.5a15 15 0 0 1 18 0" />
      <path d="M6.5 13.5a10 10 0 0 1 11 0" />
      <path d="M10.5 17.3a4.5 4.5 0 0 1 3 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BatteryIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="2" y="7" width="18" height="10" rx="2.5" />
      <rect x="4" y="9" width="13" height="6" rx="1" fill="currentColor" stroke="none" />
      <path d="M21 10v4" strokeLinecap="round" />
    </svg>
  );
}

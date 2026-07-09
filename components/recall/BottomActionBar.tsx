"use client";

import type { ReactNode } from "react";

/**
 * Pins its children to the true bottom of the viewport — position: fixed,
 * safe-area-aware — instead of relying on flex-grow to stretch a box down
 * to the bottom. On real mobile browsers that flex-fill approach could
 * leave a gap under these actions instead of reaching the bottom edge;
 * fixed positioning is anchored to the actual viewport regardless of how
 * tall the content above happens to render.
 *
 * Renders the same children twice: once invisible in normal document flow
 * (purely to reserve their exact height, safe-area inset included, so
 * pulling the real bar out of flow doesn't shift whatever is centered
 * above it — mic, confirmation card, coaching card), and once for real in
 * the fixed bar. The invisible copy is `aria-hidden` and `invisible`, so
 * it's neither seen nor reachable by screen readers or keyboard/pointer.
 */
export function BottomActionBar({ children }: { children: ReactNode }) {
  return (
    <>
      <div
        aria-hidden
        className="invisible flex justify-center"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="w-full max-w-[390px] px-400 pb-400">{children}</div>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-10 flex justify-center bg-app-bg"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="w-full max-w-[390px] px-400 pb-400">{children}</div>
      </div>
    </>
  );
}

import { HomeIcon, SearchIcon, TargetIcon, BubbleIcon, ProfileIcon } from "./icons";

/**
 * Decorative bottom navigation (reference/navbar.svg) — layout/chrome only,
 * for native-app feel. No routing: Voice Recall doesn't own these tabs.
 */
export function BottomNav() {
  return (
    <div className="mt-auto flex shrink-0 flex-col border-t border-white/10 bg-app-bg pt-200">
      <div
        aria-hidden
        className="flex items-center justify-between px-400"
      >
        <HomeIcon size={24} className="text-ink-secondary" />
        <SearchIcon size={24} className="text-ink-secondary" />
        <TargetIcon size={24} className="text-purple-bold" />
        <BubbleIcon size={24} className="text-ink-secondary" />
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-primary">
          <ProfileIcon size={18} className="text-ink-inverse" />
        </div>
      </div>
      <div className="flex justify-center py-200">
        <span className="h-[5px] w-[131px] rounded-full bg-ink-primary" />
      </div>
    </div>
  );
}

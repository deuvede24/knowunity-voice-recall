import { SignalIcon, WifiIcon, BatteryIcon } from "./icons";

/**
 * Mocked phone status bar (time + signal/wifi/battery) — prototype-rules.md
 * "Making it feel like a real phone app". Fixed "9:41" like the reference
 * screenshots and wireflow.html, not a live clock: this is chrome, not data.
 */
export function StatusBar() {
  return (
    <div
      aria-hidden
      className="flex shrink-0 items-center justify-between px-400 pt-100 text-ink-primary"
    >
      <span className="text-caption-m font-semibold">9:41</span>
      <div className="flex items-center gap-150">
        <SignalIcon size={16} />
        <WifiIcon size={16} />
        <BatteryIcon size={20} />
      </div>
    </div>
  );
}

import { ProgressBar } from "./ProgressBar";
import { CloseIcon, MoreIcon } from "./icons";

/** Recall-loop top bar: session progress + exit + current term counter. */
export function RecallTopBar({
  fraction,
  term,
  onExit,
}: {
  fraction: number;
  /** Omit on screens with no active term (e.g. the summary). */
  term?: { current: number; total: number };
  onExit: () => void;
}) {
  return (
    <div className="flex flex-col gap-100 px-400 pt-400">
      <div className="flex items-center gap-300">
        <ProgressBar fraction={fraction} />
        <button
          type="button"
          onClick={onExit}
          aria-label="Exit Voice Recall"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-secondary"
        >
          <CloseIcon size={18} />
        </button>
      </div>
      {term && (
        <span className="text-caption-s font-semibold uppercase tracking-wide text-ink-disabled">
          Term {term.current} of {term.total}
        </span>
      )}
    </div>
  );
}

/** Topic screen top bar: plain overflow menu, no progress (not in the recall loop yet). */
export function TopicTopBar() {
  return (
    <div className="flex items-center justify-end px-400 pt-400">
      <button
        type="button"
        aria-label="More options"
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink-secondary"
      >
        <MoreIcon size={18} />
      </button>
    </div>
  );
}

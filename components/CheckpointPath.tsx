import { ChecklistIcon } from "./icons";

export interface Checkpoint {
  label: string;
}

/** Horizontal drift (each way from center) between alternating checkpoints,
 * matching the zigzag rhythm in reference/checkpoints.svg (circle centers:
 * 165.5, 224.5, 165.5… — a 59px swing, split evenly so the path stays centered). */
const ZIGZAG_HALF = 29.5;

/**
 * Decorative checkpoint path below the Topic card — visual context only
 * (reference/checkpoints.svg), not a real interactive checkpoint system.
 * The first checkpoint reads as active (solid fill); the rest read as
 * upcoming (muted fill), matching the reference's active/upcoming states.
 */
export function CheckpointPath({ checkpoints }: { checkpoints: Checkpoint[] }) {
  return (
    <div className="flex flex-col items-center">
      {checkpoints.map((checkpoint, index) => {
        const isActive = index === 0;
        const isLast = index === checkpoints.length - 1;
        const offset = index % 2 === 1 ? ZIGZAG_HALF : -ZIGZAG_HALF;
        const nextOffset = index % 2 === 1 ? -ZIGZAG_HALF : ZIGZAG_HALF;

        return (
          <div key={checkpoint.label} className="flex flex-col items-center">
            <div
              className="flex flex-col items-center"
              style={{ transform: `translateX(${offset}px)` }}
            >
              <div className="flex h-[110px] w-[110px] items-center justify-center rounded-full border-8 border-white/10">
                <div
                  className={`flex h-[88px] w-[88px] items-center justify-center rounded-full ${
                    isActive ? "bg-purple-bold" : "bg-white/10"
                  }`}
                >
                  <ChecklistIcon
                    size={44}
                    className={isActive ? "text-ink-primary" : "text-purple-bold"}
                  />
                </div>
              </div>

              <p className="mt-200 w-[170px] text-center text-headline-s font-bold text-ink-primary">
                {checkpoint.label}
              </p>
            </div>

            {!isLast && (
              <div
                className="flex flex-col items-center gap-150 py-200"
                style={{ transform: `translateX(${(offset + nextOffset) / 2}px)` }}
              >
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="h-2 w-2 rounded-full bg-white/10"
                    style={{
                      transform: `translateX(${(dot - 1) * (nextOffset > offset ? 5 : -5)}px)`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

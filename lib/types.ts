export type ConfirmationMode = "transcript" | "headline" | "none";

export type Expression =
  | "standby"
  | "approving"
  | "excited"
  | "thinking"
  | "dazed"
  | "confused"
  | "determined"
  | "giggling"
  | "laughing"
  | "amazed"
  | "micro";

export type CoachingBand = "gotIt" | "almostThere" | "letsBuildOnThat";

export type ConceptOutcomeStatus = "pending" | "gotIt" | "practising";

export interface Concept {
  id: string;
  term: string;
  transcript: string;
  headline: string;
  /** First-attempt coaching band; fixed per concept, deterministic every run. */
  firstAttemptBand: CoachingBand;
  firstAttemptExpression: Expression;
  firstAttemptCopy: { title: string; body: string };
  /** Only concepts whose first attempt isn't gotIt define a retry outcome. */
  retry?: {
    band: CoachingBand;
    expression: Expression;
    copy: { title: string; body: string };
    reminder: string;
  };
  /** Whether this concept's demo path ends in a skip rather than a retry. */
  demoResolution: "gotItFirstTry" | "retryThenGotIt" | "skipAfterHint";
}

export type RecallState =
  | { kind: "permissionPrimer" }
  | { kind: "conceptIdle"; conceptIndex: number; showReminder: boolean }
  | { kind: "recording"; conceptIndex: number }
  | { kind: "paused"; conceptIndex: number; elapsedSeconds: number }
  | { kind: "typing"; conceptIndex: number }
  | { kind: "confirmation"; conceptIndex: number; isRetry: boolean }
  | { kind: "thinking"; conceptIndex: number; isRetry: boolean }
  | { kind: "coaching"; conceptIndex: number; isRetry: boolean }
  | { kind: "skipped"; conceptIndex: number }
  | { kind: "summary" };

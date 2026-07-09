"use client";

import type { ConfirmationMode } from "./types";

const CONFIRMATION_MODE_KEY = "voiceRecall.confirmationMode";
const HAS_OPENED_MODE_SELECTOR_KEY = "voiceRecall.hasOpenedModeSelector";
const HAS_SEEN_PERMISSION_PRIMER_KEY = "voiceRecall.hasSeenPermissionPrimer";
const HAS_SEEN_ENTRY_MIC_DOT_KEY = "voiceRecall.hasSeenEntryMicDot";

function readLocalStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocalStorage(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore write failures (private browsing, quota, etc.)
  }
}

export function getConfirmationMode(): ConfirmationMode {
  const stored = readLocalStorage(CONFIRMATION_MODE_KEY);
  if (stored === "transcript" || stored === "headline" || stored === "none") {
    return stored;
  }
  return "transcript";
}

export function setConfirmationMode(mode: ConfirmationMode): void {
  writeLocalStorage(CONFIRMATION_MODE_KEY, mode);
}

export function getHasOpenedModeSelector(): boolean {
  return readLocalStorage(HAS_OPENED_MODE_SELECTOR_KEY) === "true";
}

export function setHasOpenedModeSelector(): void {
  writeLocalStorage(HAS_OPENED_MODE_SELECTOR_KEY, "true");
}

export function getHasSeenPermissionPrimer(): boolean {
  return readLocalStorage(HAS_SEEN_PERMISSION_PRIMER_KEY) === "true";
}

export function setHasSeenPermissionPrimer(): void {
  writeLocalStorage(HAS_SEEN_PERMISSION_PRIMER_KEY, "true");
}

/** Entry screen mic discovery dot — shown once, first time Helena lands on Entry. */
export function getHasSeenEntryMicDot(): boolean {
  return readLocalStorage(HAS_SEEN_ENTRY_MIC_DOT_KEY) === "true";
}

export function setHasSeenEntryMicDot(): void {
  writeLocalStorage(HAS_SEEN_ENTRY_MIC_DOT_KEY, "true");
}

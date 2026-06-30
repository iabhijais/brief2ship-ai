import type { AnalysisResult } from "./types";

const KEY = "brief2ship:v1";

interface StoredState {
  brief: string;
  result: AnalysisResult;
  source: "gemini" | "mock";
  savedAt: number;
}

export function saveState(state: Omit<StoredState, "savedAt">): void {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredState = { ...state, savedAt: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // localStorage can throw (quota / private mode) — fail silently.
  }
}

export function loadState(): StoredState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredState;
    if (!parsed?.result?.projectTitle) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

// Saves learning progress in the browser's own storage (localStorage).
// It stays on this device and needs no account. Only use it from
// components that start with "use client", since it needs the browser.
//
// Everything about saving lives in this one file. When we add accounts
// (Supabase) later, this is the only file that needs to change.

import { useSyncExternalStore } from "react";

// The name our data is stored under. The "v1" lets us change the shape
// of the data later without mixing it up with old saves.
const STORAGE_KEY = "kata.progress.v1";

// What we remember about each word.
export type WordProgress = {
  correctDays: string[]; // days the word was answered correctly, "2026-10-19"
  lastResult: "know" | "missed" | null; // the most recent answer
  lastSeenAt: string | null; // when it was last practiced
};

// Everything we save.
export type Progress = {
  version: 1;
  words: Record<string, WordProgress>; // keyed by word id, e.g. "ja-mizu"
  activeDays: string[]; // days with any practice, for the streak
};

export type WordStatus = "new" | "learning" | "mastered" | "needs-practice";

const EMPTY_PROGRESS: Progress = { version: 1, words: {}, activeDays: [] };

/* ---------- Dates ---------- */

// Today's date in the learner's own time zone, as "2026-10-19".
export function dayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/* ---------- Reading and writing ---------- */

// The progress currently in memory. Loaded from storage the first time
// it's needed, then kept here so every component sees the same data.
let current: Progress | null = null;

function loadFromStorage(): Progress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const data = JSON.parse(raw);
    // Only accept data in the shape we expect. Anything else (an old or
    // damaged save) is ignored rather than breaking the site.
    if (
      data?.version === 1 &&
      typeof data.words === "object" &&
      Array.isArray(data.activeDays)
    ) {
      return data as Progress;
    }
  } catch {
    // Storage can be blocked (some private browsing modes). Start fresh.
  }
  return EMPTY_PROGRESS;
}

export function getProgress(): Progress {
  if (current === null) current = loadFromStorage();
  return current;
}

function setProgress(next: Progress) {
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // If saving fails, progress still works until the page is closed.
  }
  notifyListeners();
}

/* ---------- Telling components about changes ---------- */

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

// Called by React to get updates. Also listens for changes made in
// another tab, so two open tabs stay in sync.
function subscribe(listener: () => void) {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      current = loadFromStorage();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// Use this in a component to read progress. The component updates
// automatically whenever progress changes. While the page is being
// built on the server there's no browser storage, so it starts empty.
export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, getProgress, () => EMPTY_PROGRESS);
}

/* ---------- Actions ---------- */

// Records a flashcard or quiz answer for one word.
export function recordAnswer(wordId: string, result: "know" | "missed") {
  const progress = getProgress();
  const today = dayKey();
  const previous: WordProgress = progress.words[wordId] ?? {
    correctDays: [],
    lastResult: null,
    lastSeenAt: null,
  };

  // Each day counts once, however many times the word is answered.
  const correctDays =
    result === "know" && !previous.correctDays.includes(today)
      ? [...previous.correctDays, today]
      : previous.correctDays;

  setProgress({
    ...progress,
    words: {
      ...progress.words,
      [wordId]: {
        correctDays,
        lastResult: result,
        lastSeenAt: new Date().toISOString(),
      },
    },
    activeDays: progress.activeDays.includes(today)
      ? progress.activeDays
      : [...progress.activeDays, today],
  });
}

// Clears all saved progress on this device.
export function resetProgress() {
  setProgress(EMPTY_PROGRESS);
}

/* ---------- Summaries ---------- */

// Where a word stands:
// - new             never practiced
// - needs practice  the last answer was "Missed"
// - mastered        answered correctly on two different days
// - learning        anything in between
export function getWordStatus(entry: WordProgress | undefined): WordStatus {
  if (!entry) return "new";
  if (entry.lastResult === "missed") return "needs-practice";
  if (entry.correctDays.length >= 2) return "mastered";
  return "learning";
}

// Counts for the Profile page.
export function countByStatus(progress: Progress) {
  const counts = { learning: 0, mastered: 0, needsPractice: 0 };
  for (const entry of Object.values(progress.words)) {
    const status = getWordStatus(entry);
    if (status === "learning") counts.learning++;
    if (status === "mastered") counts.mastered++;
    if (status === "needs-practice") counts.needsPractice++;
  }
  return counts;
}

// How many days in a row the learner has practiced. Today counts if
// they've practiced today; if not, the streak is still alive from
// yesterday until the day ends.
export function getStreak(activeDays: string[], today?: Date) {
  // No practice yet means no streak. Returning early also keeps the
  // date check out of the page Next.js prepares in advance, where
  // "today" would be the day the site was built.
  if (activeDays.length === 0) return 0;

  const days = new Set(activeDays);
  const cursor = today ? new Date(today) : new Date();

  if (!days.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

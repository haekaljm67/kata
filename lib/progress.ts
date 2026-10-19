// Saves learning progress in the browser's own storage (localStorage).
// It stays on this device and needs no account. Only use it from
// components that start with "use client", since it needs the browser.
//
// Everything about saving progress lives in this one file. When we add
// accounts (Supabase) later, this is the only file that needs to change.

import { now } from "./clock";
import { createLocalStore } from "./localStore";

/* ---------- The shape of saved progress ---------- */

// What we remember about each word.
export type WordProgress = {
  correctDays: string[]; // days the word was answered correctly, "2026-10-19"
  lastResult: "know" | "missed" | null; // the most recent answer
  lastSeenAt: string | null; // when it was last practiced
  step: number; // how far along the review schedule it is (0 = start)
  dueDay: string | null; // the day it should come back, "2026-10-22"
};

// Everything we save.
export type Progress = {
  version: 1;
  words: Record<string, WordProgress>; // keyed by word id, e.g. "ja-mizu"
  activeDays: string[]; // days with any practice, for the streak
};

export type WordStatus = "new" | "learning" | "mastered" | "needs-practice";

const EMPTY_PROGRESS: Progress = { version: 1, words: {}, activeDays: [] };

/* ---------- The review schedule (spaced repetition) ---------- */

// After each "Know", a word waits longer before it comes back:
// 1 day, then 3, 7, 14 and 30 days. A "Missed" sends it back to the
// start, so it comes back right away.
export const REVIEW_INTERVALS_IN_DAYS = [1, 3, 7, 14, 30];

/* ---------- Dates ---------- */

// A date in the learner's own time zone, as "2026-10-19".
// Written this way, dates also sort correctly as plain text.
export function dayKey(date: Date = now()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Adds days to a "2026-10-19" date, handling month and year changes.
export function addDays(day: string, days: number): string {
  const [year, month, date] = day.split("-").map(Number);
  return dayKey(new Date(year, month - 1, date + days));
}

/* ---------- Reading and writing ---------- */

// Fills in anything missing from an older save, so the rest of the
// code can always count on every field being there.
function normalizeWord(entry: Partial<WordProgress>): WordProgress {
  return {
    correctDays: Array.isArray(entry.correctDays) ? entry.correctDays : [],
    lastResult: entry.lastResult ?? null,
    lastSeenAt: entry.lastSeenAt ?? null,
    step: typeof entry.step === "number" ? entry.step : 0,
    dueDay: entry.dueDay ?? null,
  };
}

function normalizeProgress(data: unknown): Progress | null {
  const saved = data as Partial<Progress> | null;
  if (
    saved?.version !== 1 ||
    typeof saved.words !== "object" ||
    saved.words === null ||
    !Array.isArray(saved.activeDays)
  ) {
    return null;
  }
  const words: Record<string, WordProgress> = {};
  for (const [id, entry] of Object.entries(saved.words)) {
    words[id] = normalizeWord(entry);
  }
  return { version: 1, words, activeDays: saved.activeDays };
}

// The name our data is stored under. The "v1" lets us change the shape
// of the data later without mixing it up with old saves.
const store = createLocalStore("kata.progress.v1", EMPTY_PROGRESS, normalizeProgress);

// Reads progress once, for example when a flashcard round starts.
export const getProgress = store.get;

// Reads progress in a component, which then updates automatically.
export function useProgress(): Progress {
  return store.useValue();
}

/* ---------- Actions ---------- */

// Records a flashcard or quiz answer for one word.
export function recordAnswer(wordId: string, result: "know" | "missed") {
  const progress = getProgress();
  const today = dayKey();
  const previous = normalizeWord(progress.words[wordId] ?? {});

  let step: number;
  let dueDay: string;
  if (result === "know") {
    // Move one step along the schedule (stopping at the last step) and
    // wait that step's number of days.
    step = Math.min(previous.step + 1, REVIEW_INTERVALS_IN_DAYS.length);
    dueDay = addDays(today, REVIEW_INTERVALS_IN_DAYS[step - 1]);
  } else {
    // Back to the start, and due again right away.
    step = 0;
    dueDay = today;
  }

  // Each day counts once, however many times the word is answered.
  const correctDays =
    result === "know" && !previous.correctDays.includes(today)
      ? [...previous.correctDays, today]
      : previous.correctDays;

  store.set({
    ...progress,
    words: {
      ...progress.words,
      [wordId]: {
        correctDays,
        lastResult: result,
        lastSeenAt: now().toISOString(),
        step,
        dueDay,
      },
    },
    activeDays: progress.activeDays.includes(today)
      ? progress.activeDays
      : [...progress.activeDays, today],
  });
}

// Marks today as a practice day (for the streak) without changing any
// word. Used when a quiz answer is right.
export function recordActivity() {
  const progress = getProgress();
  const today = dayKey();
  if (progress.activeDays.includes(today)) return;
  store.set({ ...progress, activeDays: [...progress.activeDays, today] });
}

// Clears all saved progress on this device.
export function resetProgress() {
  store.set(EMPTY_PROGRESS);
}

/* ---------- Summaries ---------- */

// Is this word due for review on the given day?
export function isDue(entry: WordProgress, today: string): boolean {
  return entry.dueDay === null || entry.dueDay <= today;
}

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
  const cursor = today ? new Date(today) : now();

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

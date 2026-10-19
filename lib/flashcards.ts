// Picks which cards go into a flashcard round.
// Kept separate from the page so the rules are easy to read and test.

import { isDue, type Progress } from "./progress";
import type { Word } from "./types";

// How many cards a round has, at most.
export const ROUND_SIZE = 10;

// When a card is missed, it comes back this many cards later in the
// same round (or at the end, if fewer cards are left).
export const MISSED_CARD_GAP = 3;

// "due"   a normal round: due words first, then new words
// "extra" a bonus round when nothing is due: words coming up soonest
export type RoundMode = "due" | "extra";

export function buildRound(
  words: Word[],
  progress: Progress,
  today: string, // "2026-10-19"
  mode: RoundMode,
): Word[] {
  const practiced = words.filter((word) => progress.words[word.id]);
  const dueDayOf = (word: Word) => progress.words[word.id].dueDay ?? "";

  if (mode === "extra") {
    return practiced
      .filter((word) => !isDue(progress.words[word.id], today))
      .sort((a, b) => dueDayOf(a).localeCompare(dueDayOf(b)))
      .slice(0, ROUND_SIZE);
  }

  // Due words: missed ones first, then the ones that have waited longest.
  const due = practiced
    .filter((word) => isDue(progress.words[word.id], today))
    .sort((a, b) => {
      const aMissed = progress.words[a.id].lastResult === "missed" ? 0 : 1;
      const bMissed = progress.words[b.id].lastResult === "missed" ? 0 : 1;
      return aMissed - bMissed || dueDayOf(a).localeCompare(dueDayOf(b));
    });

  // New words, in the order they appear in words.json.
  const fresh = words.filter((word) => !progress.words[word.id]);

  return [...due, ...fresh].slice(0, ROUND_SIZE);
}

// Picks a comfortable text size for the big word, so long words and
// phrases fit on a phone without breaking awkwardly.
// Japanese characters are about twice as wide as Latin letters.
export function bigWordSizeClass(word: string): string {
  let widthInEm = 0;
  for (const char of word) {
    widthInEm += /[　-鿿＀-￯]/.test(char) ? 1 : 0.58;
  }
  // The space available is roughly 260px on a small phone.
  if (widthInEm * 72 <= 260) return "text-7xl";
  if (widthInEm * 60 <= 260) return "text-6xl";
  if (widthInEm * 48 <= 260) return "text-5xl";
  if (widthInEm * 36 <= 260) return "text-4xl";
  return "text-3xl";
}

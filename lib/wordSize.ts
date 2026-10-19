// Picks a comfortable text size for a big word (on flashcards, quiz
// questions and the welcome page), so long words and phrases fit on a
// phone without breaking awkwardly.
//
// Kept in its own file with no other imports, so pages that run on the
// server (like the welcome page) can use it too.

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

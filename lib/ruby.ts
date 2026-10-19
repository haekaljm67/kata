// Furigana: small kana readings shown above kanji.
//
// In content files, a kanji with its reading is written like this:
//   {友|とも}だちと{話|はな}します。
// The part before | is the kanji, the part after is its reading.
// The site shows the reading above the kanji. Text without braces
// is shown as it is.

import type { Word } from "./types";

export type RubyPart = string | { base: string; reading: string };

const RUBY = /\{([^|{}]+)\|([^{}]+)\}/g;

// Splits marked-up text into plain pieces and kanji-with-reading pieces.
export function parseRuby(text: string): RubyPart[] {
  const parts: RubyPart[] = [];
  let last = 0;
  for (const match of text.matchAll(RUBY)) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push({ base: match[1], reading: match[2] });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

// The text without readings: "{友|とも}だち" → "友だち".
export function plainText(text: string): string {
  return text.replace(RUBY, "$1");
}

// A word with its reading placed over just the kanji.
// 友だち + ともだち → {友|とも}だち (the kana だち needs no reading).
export function wordMarkup(word: Word): string {
  const { word: written, reading } = word;
  if (!reading || reading === written) return written;

  // Skip kana that are the same at the start and end of both.
  let start = 0;
  while (start < written.length && written[start] === reading[start]) start++;
  let end = 0;
  while (
    end < written.length - start &&
    end < reading.length - start &&
    written[written.length - 1 - end] === reading[reading.length - 1 - end]
  ) {
    end++;
  }

  const kanji = written.slice(start, written.length - end);
  const kanjiReading = reading.slice(start, reading.length - end);
  if (!kanji || !kanjiReading) return written;
  return `${written.slice(0, start)}{${kanji}|${kanjiReading}}${written.slice(written.length - end)}`;
}

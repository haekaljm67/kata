// The rules for quizzes: which words to ask about, which question
// type each gets, believable wrong options, checking typed answers,
// and the short explanation shown after every answer.
//
// Kept separate from the page so the rules are easy to read and test.
// "random" can be swapped out in tests to get the same quiz every time.

import { getWordStatus, type Progress } from "./progress";
import { plainText, wordMarkup } from "./ruby";
import type { LanguageMeta, Word } from "./types";

export const QUIZ_LENGTH = 10;
const OPTION_COUNT = 4;

export type QuestionType = "meaning" | "listening" | "blank";

export type Question = {
  type: QuestionType;
  word: Word; // the word being tested
  options: Word[]; // the choices, including the right one, shuffled
  blank?: Blank; // only for fill-in-the-blank questions
};

// An example sentence split around the missing word.
// Each piece may contain furigana markup.
export type Blank = {
  before: string;
  answer: string; // the word exactly as written in the sentence
  after: string;
};

type Random = () => number;

/* ---------- Small helpers ---------- */

// Returns a shuffled copy of a list.
function shuffle<T>(items: T[], random: Random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Greetings, polite phrases and yes/no answers make believable
// alternatives for each other, so they count as one group.
function wordGroup(word: Word): string {
  return ["greeting", "expression", "answer"].includes(word.partOfSpeech)
    ? "phrase"
    : word.partOfSpeech;
}

// Do two words share a meaning? ("sorry; excuse me" and "excuse me")
function sharesMeaning(a: Word, b: Word): boolean {
  const meanings = (w: Word) =>
    w.meaning.split(";").map((m) => m.replace(/\(.*?\)/g, "").trim().toLowerCase());
  const aMeanings = meanings(a);
  return meanings(b).some((m) => aMeanings.includes(m));
}

/* ---------- Choosing the words ---------- */

// Words seen in flashcards come first: ones that need practice, then
// ones being learned, then mastered ones. New words only fill gaps.
export function pickQuizWords(
  words: Word[],
  progress: Progress,
  random: Random = Math.random,
): Word[] {
  const order = { "needs-practice": 0, learning: 1, mastered: 2 } as const;
  const seen = shuffle(
    words.filter((w) => progress.words[w.id]),
    random,
  ).sort((a, b) => {
    const statusA = getWordStatus(progress.words[a.id]) as keyof typeof order;
    const statusB = getWordStatus(progress.words[b.id]) as keyof typeof order;
    return order[statusA] - order[statusB];
  });
  const fresh = words.filter((w) => !progress.words[w.id]);

  // Mix the chosen words so the hardest ones aren't all at the start.
  return shuffle([...seen, ...fresh].slice(0, QUIZ_LENGTH), random);
}

/* ---------- Fill in the blank ---------- */

// Finds the word in its example sentence. Returns null if the word
// has no blank notes, or isn't in the sentence exactly as written
// (for example 食べる appears as 食べます). Such words don't get
// fill-in-the-blank questions.
//
// The sentence may contain furigana markup ({本|ほん}); the pieces
// returned keep it, so readings still show around the blank.
export function findBlank(word: Word, language: LanguageMeta): Blank | null {
  if (!word.teach.blank) return null;
  const text = word.example.text;

  if (language.code === "ja") {
    // Japanese doesn't put spaces between words, so look for the
    // exact characters: first with its reading markup, then without.
    for (const form of [wordMarkup(word), word.word]) {
      const start = text.indexOf(form);
      if (start === -1) continue;
      return {
        before: text.slice(0, start),
        answer: form,
        after: text.slice(start + form.length),
      };
    }
    return null;
  }

  // Other languages: match whole words only, ignoring capitals, so
  // "no" doesn't match inside "know".
  const escaped = word.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`(?<![\\p{L}])${escaped}(?![\\p{L}])`, "iu").exec(text);
  if (!match) return null;
  return {
    before: text.slice(0, match.index),
    answer: match[0],
    after: text.slice(match.index + match[0].length),
  };
}

/* ---------- Wrong options ---------- */

// Picks believable wrong options.
// - Fill in the blank: the hand-picked options from words.json, which
//   are chosen so that only one answer fits the sentence.
// - Other questions: same level, the same kind of word first, never
//   one that shares the right answer's meaning.
export function pickDistractors(
  target: Word,
  words: Word[],
  type: QuestionType,
  random: Random = Math.random,
): Word[] {
  if (type === "blank") {
    const chosen = target.teach.blank?.wrongOptions ?? [];
    return shuffle(
      words.filter((w) => chosen.includes(w.id)),
      random,
    ).slice(0, OPTION_COUNT - 1);
  }

  const candidates = words.filter(
    (w) =>
      w.id !== target.id &&
      w.level === target.level &&
      w.word !== target.word &&
      !sharesMeaning(w, target),
  );
  const sameGroup = candidates.filter((w) => wordGroup(w) === wordGroup(target));
  const others = candidates.filter((w) => wordGroup(w) !== wordGroup(target));

  return [...shuffle(sameGroup, random), ...shuffle(others, random)].slice(
    0,
    OPTION_COUNT - 1,
  );
}

/* ---------- Building the quiz ---------- */

export function buildQuiz(
  words: Word[],
  language: LanguageMeta,
  progress: Progress,
  canListen: boolean, // does this device have a voice for the language?
  random: Random = Math.random,
): Question[] {
  const counts: Record<QuestionType, number> = { meaning: 0, listening: 0, blank: 0 };

  return pickQuizWords(words, progress, random).map((word) => {
    const blank = findBlank(word, language);

    // The types this word can have.
    const possible: QuestionType[] = ["meaning"];
    if (canListen) possible.push("listening");
    if (blank) possible.push("blank");

    // Keep the mix even: choose the type used least so far
    // (ties are broken at random).
    const fewest = Math.min(...possible.map((t) => counts[t]));
    const tied = possible.filter((t) => counts[t] === fewest);
    const type = tied[Math.floor(random() * tied.length)];
    counts[type]++;

    const options = shuffle(
      [word, ...pickDistractors(word, words, type, random)],
      random,
    );
    return { type, word, options, ...(type === "blank" && blank ? { blank } : {}) };
  });
}

/* ---------- Typed answers ---------- */

// Makes typed text comparable: no capitals, no extra spaces, no
// punctuation at the ends, and full-width letters made normal.
function tidyAnswer(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/^[\s.,!?。、！？]+|[\s.,!?。、！？]+$/g, "")
    .replace(/\s+/g, " ");
}

// Long vowels can be typed several ways: arigatō, arigatou, arigato.
function romanizationVariants(romanization: string): string[] {
  const variants = new Set([romanization]);
  for (const [long, ways] of [
    ["ō", ["ou", "oo", "o"]],
    ["ū", ["uu", "u"]],
    ["ā", ["aa", "a"]],
    ["ē", ["ee", "ei", "e"]],
    ["ī", ["ii", "i"]],
  ] as const) {
    for (const v of [...variants]) {
      if (v.includes(long)) for (const way of ways) variants.add(v.replaceAll(long, way));
    }
  }
  return [...variants];
}

// Is a typed answer right? Accepts the word itself, its kana reading,
// and its romanization (for Japanese, so learners without a Japanese
// keyboard can type "neko").
export function isTypedAnswerCorrect(typed: string, word: Word, blank?: Blank): boolean {
  const accepted = [word.word, word.reading, blank && plainText(blank.answer)]
    .concat(word.romanization ? romanizationVariants(word.romanization) : [])
    .filter((a): a is string => Boolean(a))
    .map(tidyAnswer);
  return accepted.includes(tidyAnswer(typed));
}

/* ---------- Explanations ---------- */

// The learner's choice: an option they tapped, or text they typed.
export type Choice = { word: Word } | { typed: string };

// How a word is written in an explanation: 本 with its reading above
// and romanization after, like 本 (hon); or just "cat".
function name(word: Word): string {
  const written = wordMarkup(word);
  return word.romanization ? `${written} (${word.romanization})` : written;
}

// Starts a sentence with a capital letter ("buku" → "Buku").
function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// A short explanation that teaches one useful thing, using the notes
// written for each word in words.json. The "Correct" / "Not quite"
// heading is shown separately, so it's never repeated here.
// The text may contain furigana markup; show it with <RubyText>.
export function explain(question: Question, choice: Choice, correct: boolean): string {
  const { word } = question;
  const { teach } = word;
  const picked = "word" in choice ? choice.word : null;

  if (question.type === "meaning") {
    if (correct) return teach.meaning;
    // Say what it really means, then the tip.
    return `${capitalize(name(word))} means “${word.meaning}”, not “${picked!.meaning}”. ${teach.meaning}`;
  }

  if (question.type === "listening") {
    if (correct) return teach.sound;
    return `That was ${name(word)}, “${word.meaning}”. ${teach.sound}`;
  }

  // Fill in the blank. The tip names the clue in the sentence; the hand-
  // picked wrong options are all ruled out by that clue.
  const tip = teach.blank?.tip ?? "";
  if (correct) return tip;
  if (picked) return `${tip} That's why ${name(picked)} doesn't fit here.`;
  return `The missing word is ${name(word)}. ${tip}`;
}

// The shapes of our lesson content. These match the JSON files in
// content/languages/<code>/. If a file is missing a field, the
// code editor underlines the mistake before it reaches the site.

// The level systems we support. CEFR runs A1 → C2, JLPT runs N5 → N1.
// Mandarin will use HSK when it's added.
export type LevelFramework = "CEFR" | "JLPT" | "HSK";

// language.json: facts about the language itself.
export type LanguageMeta = {
  code: string; // short code, same as the folder name: "en", "id", "ja"
  name: string; // name in English: "Japanese"
  nativeName: string; // name in the language itself: "日本語"
  framework: LevelFramework;
  levels: string[]; // every level, easiest first
  startLevel: string; // where beginners start
  usesRomanization: boolean; // show the optional romanization hint?
  speechLang: string; // voice code for the browser's text-to-speech: "ja-JP"
  sampleWord?: string; // id of the word shown for this language on the welcome page
};

// An example sentence that shows a word in use.
export type ExampleSentence = {
  // Kanji can carry readings, written {漢字|かんじ}. See lib/ruby.ts.
  text: string;
  romanization?: string;
  // The meaning in English, the interface language.
  // Leave it out for English sentences, which need no translation.
  translation?: string;
};

// A native recording, with the credit its license requires.
export type AudioClip = {
  url: string;
  credit: string;
  license: string;
};

// Short teaching notes shown after quiz answers. Each one teaches one
// useful thing, rather than repeating the answer.
export type TeachingNotes = {
  meaning: string; // about using the word (multiple choice questions)
  sound: string; // about saying the word (listening questions)
  // For fill-in-the-blank questions. Leave it out if the example
  // sentence has no clear clue (if several words could fit the blank).
  blank?: {
    tip: string; // the clue in the sentence that points to the answer
    // Hand-picked wrong options (word ids from the same language).
    // Each one must clearly NOT fit, so the quiz never has two right
    // answers. The tip should explain why they don't fit.
    wrongOptions: string[];
  };
};

// One entry in words.json.
export type Word = {
  id: string; // unique across all languages: "ja-mizu"
  word: string; // what's shown big on the flashcard
  reading?: string; // kana reading for words written in kanji
  romanization?: string;
  meaning: string;
  partOfSpeech: string;
  level: string; // one of the language's levels: "A1", "N5"
  example: ExampleSentence;
  audio: AudioClip | null; // null means: use the browser's text-to-speech
  teach: TeachingNotes;
  nativeCheck: "needed" | "done"; // has a native speaker reviewed this?
};

// A language with all of its words, ready to use on a page.
export type Language = {
  meta: LanguageMeta;
  words: Word[];
};

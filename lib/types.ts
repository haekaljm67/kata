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
};

// An example sentence that shows a word in use.
export type ExampleSentence = {
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
  nativeCheck: "needed" | "done"; // has a native speaker reviewed this?
};

// A language with all of its words, ready to use on a page.
export type Language = {
  meta: LanguageMeta;
  words: Word[];
};

// Reads lesson content from the content/languages folder.
//
// This runs while the site is being built (on the "server" side),
// never in the visitor's browser. It finds every language folder on
// its own, so adding a new language means adding a folder, with no
// code changes here.

import fs from "node:fs";
import path from "node:path";
import type { Language, LanguageMeta, Word } from "./types";

const LANGUAGES_DIR = path.join(process.cwd(), "content", "languages");

// Reads one JSON file and explains clearly what went wrong if it can't.
function readJson<T>(filePath: string): T {
  const relative = path.relative(process.cwd(), filePath);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing content file: ${relative}`);
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    throw new Error(
      `Couldn't read ${relative}. Check it for a missing comma or quote.`,
    );
  }
}

// Loads one language by its folder name, for example "ja".
export function getLanguage(code: string): Language {
  const folder = path.join(LANGUAGES_DIR, code);
  const meta = readJson<LanguageMeta>(path.join(folder, "language.json"));
  const words = readJson<Word[]>(path.join(folder, "words.json"));

  // Catch the most likely copy-and-paste mistakes early.
  if (meta.code !== code) {
    throw new Error(
      `content/languages/${code}/language.json says its code is "${meta.code}". It should match the folder name "${code}".`,
    );
  }
  const ids = new Set(words.map((w) => w.id));
  for (const word of words) {
    const where = `Word "${word.id}" in ${code}/words.json`;
    if (!meta.levels.includes(word.level)) {
      throw new Error(
        `${where} has level "${word.level}", which isn't listed in ${code}/language.json.`,
      );
    }
    if (!word.teach?.meaning || !word.teach?.sound) {
      throw new Error(`${where} needs "teach" notes with "meaning" and "sound".`);
    }
    for (const optionId of word.teach.blank?.wrongOptions ?? []) {
      if (!ids.has(optionId) || optionId === word.id) {
        throw new Error(
          `${where} lists "${optionId}" as a wrong option, but that isn't another word in this language.`,
        );
      }
    }
  }

  return { meta, words };
}

// Loads every language, sorted by English name.
export function getLanguages(): Language[] {
  return fs
    .readdirSync(LANGUAGES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => getLanguage(entry.name))
    .sort((a, b) => a.meta.name.localeCompare(b.meta.name));
}

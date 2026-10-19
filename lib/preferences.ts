// Small choices the learner makes, remembered in this browser.
// For example, the language picked on the Practice pages.

import { createLocalStore } from "./localStore";

export type Preferences = {
  // The language for flashcards and quizzes, like "ja". One shared
  // choice, so switching modes keeps the same language.
  practiceLanguage?: string;
};

function normalizePreferences(data: unknown): Preferences | null {
  if (typeof data !== "object" || data === null) return null;
  const saved = data as Preferences & { flashcardLanguage?: string };
  // Earlier versions saved this as "flashcardLanguage"; keep using it.
  const language = saved.practiceLanguage ?? saved.flashcardLanguage;
  return {
    practiceLanguage: typeof language === "string" ? language : undefined,
  };
}

const store = createLocalStore("kata.preferences.v1", {}, normalizePreferences);

export function usePreferences(): Preferences {
  return store.useValue();
}

// Changes one or more preferences and keeps the rest.
export function updatePreferences(changes: Partial<Preferences>) {
  store.set({ ...store.get(), ...changes });
}

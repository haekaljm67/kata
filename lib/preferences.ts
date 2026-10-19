// Small choices the learner makes, remembered in this browser.
// For example, the language last picked for flashcards.

import { createLocalStore } from "./localStore";

export type Preferences = {
  flashcardLanguage?: string; // a language code, like "ja"
};

function normalizePreferences(data: unknown): Preferences | null {
  if (typeof data !== "object" || data === null) return null;
  const saved = data as Preferences;
  return {
    flashcardLanguage:
      typeof saved.flashcardLanguage === "string"
        ? saved.flashcardLanguage
        : undefined,
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

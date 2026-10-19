// The learner's settings, saved in this browser.
// Changed on the Profile page; read by the pages they affect.

import { createLocalStore } from "./localStore";
import { SETTINGS_KEY } from "./storageKeys";

export type Theme = "system" | "light" | "dark";
export type TextSize = "default" | "large";
export type Motion = "system" | "reduce"; // "system" follows the device
export type ReadingHelp = "always" | "tap" | "never";
export type SpeechSpeed = "normal" | "slow";

export type Settings = {
  // Appearance
  theme: Theme;
  textSize: TextSize;
  motion: Motion;
  // Learning
  dailyGoal: 5 | 10 | 20; // words a day
  readingHelp: ReadingHelp; // romanization and readings above kanji
  languages: string[] | null; // codes shown in Practice; null = all
  practiceLanguage: string | null; // the language picked in Practice
  // Audio
  autoplay: boolean; // speak the word when a flashcard appears
  speechSpeed: SpeechSpeed;
  soundEffects: boolean; // soft tones for right and wrong answers
};

export const DEFAULT_SETTINGS: Settings = {
  theme: "system",
  textSize: "default",
  motion: "system",
  dailyGoal: 10,
  readingHelp: "tap",
  languages: null,
  practiceLanguage: null,
  autoplay: false,
  speechSpeed: "normal",
  soundEffects: false,
};

// Accepts a saved value only if it's one of the allowed choices.
function oneOf<T>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

// Checks saved settings, keeping valid choices and using the default
// for anything missing or unknown (for example after an update).
function normalizeSettings(data: unknown): Settings | null {
  if (typeof data !== "object" || data === null) return null;
  const s = data as Record<string, unknown>;
  const d = DEFAULT_SETTINGS;
  // Earlier versions saved the Practice language under other names.
  const practice = s.practiceLanguage ?? s.flashcardLanguage;

  return {
    theme: oneOf(s.theme, ["system", "light", "dark"] as const, d.theme),
    textSize: oneOf(s.textSize, ["default", "large"] as const, d.textSize),
    motion: oneOf(s.motion, ["system", "reduce"] as const, d.motion),
    dailyGoal: oneOf(s.dailyGoal, [5, 10, 20] as const, d.dailyGoal),
    readingHelp: oneOf(s.readingHelp, ["always", "tap", "never"] as const, d.readingHelp),
    languages:
      Array.isArray(s.languages) && s.languages.every((l) => typeof l === "string")
        ? (s.languages as string[])
        : null,
    practiceLanguage: typeof practice === "string" ? practice : null,
    autoplay: typeof s.autoplay === "boolean" ? s.autoplay : d.autoplay,
    speechSpeed: oneOf(s.speechSpeed, ["normal", "slow"] as const, d.speechSpeed),
    soundEffects: typeof s.soundEffects === "boolean" ? s.soundEffects : d.soundEffects,
  };
}

const store = createLocalStore(SETTINGS_KEY, DEFAULT_SETTINGS, normalizeSettings);

// Reads settings once (outside of a component).
export const getSettings = store.get;

// Reads settings in a component, which then updates when they change.
export function useSettings(): Settings {
  return store.useValue();
}

// Changes one or more settings and keeps the rest.
export function updateSettings(changes: Partial<Settings>) {
  store.set({ ...store.get(), ...changes });
}

// The languages shown in Practice. Always at least one: if the saved
// list matches nothing (say, a language was removed), show them all.
export function enabledLanguages<T extends { meta: { code: string } }>(
  all: T[],
  settings: Settings,
): T[] {
  if (!settings.languages) return all;
  const enabled = all.filter((l) => settings.languages!.includes(l.meta.code));
  return enabled.length > 0 ? enabled : all;
}

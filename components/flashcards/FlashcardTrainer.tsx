"use client";
// The flashcards page: language picker on top, then one round of cards.

import { useState } from "react";
import type { RoundMode } from "@/lib/flashcards";
import { updatePreferences, usePreferences } from "@/lib/preferences";
import type { Language } from "@/lib/types";
import { useIsClient } from "@/lib/useIsClient";
import { FlashcardRound } from "./FlashcardRound";
import { LanguagePicker } from "./LanguagePicker";

export function FlashcardTrainer({ languages }: { languages: Language[] }) {
  const preferences = usePreferences();
  const isClient = useIsClient();

  // Use the language picked last time, if it still exists.
  const language =
    languages.find((l) => l.meta.code === preferences.flashcardLanguage) ??
    languages[0];

  // Each new round gets a new number, which starts it fresh.
  const [round, setRound] = useState({ number: 0, mode: "due" as RoundMode });

  function changeLanguage(code: string) {
    updatePreferences({ flashcardLanguage: code });
    setRound((r) => ({ number: r.number + 1, mode: "due" }));
  }

  function startRound(mode: RoundMode) {
    setRound((r) => ({ number: r.number + 1, mode }));
  }

  return (
    <>
      <LanguagePicker
        options={languages.map((l) => ({ code: l.meta.code, name: l.meta.name }))}
        value={language.meta.code}
        onChange={changeLanguage}
      />

      {isClient ? (
        // "key" makes React start a brand-new round whenever the
        // language or round number changes.
        <FlashcardRound
          key={`${language.meta.code}-${round.number}`}
          language={language}
          mode={round.mode}
          onStartRound={startRound}
        />
      ) : (
        // While the page loads, show an empty card of the same size so
        // nothing jumps around.
        <div className="mt-9 min-h-[21rem] rounded-[2rem] border border-line bg-surface" />
      )}
    </>
  );
}

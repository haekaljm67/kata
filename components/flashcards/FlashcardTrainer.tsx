"use client";
// The flashcards page: language picker on top, then one round of cards.

import { useState } from "react";
import type { RoundMode } from "@/lib/flashcards";
import { enabledLanguages, updateSettings, useSettings } from "@/lib/settings";
import { useVoice } from "@/lib/speech";
import type { Language } from "@/lib/types";
import { useIsClient } from "@/lib/useIsClient";
import { LanguagePicker } from "@/components/LanguagePicker";
import { FlashcardRound } from "./FlashcardRound";

export function FlashcardTrainer({ languages }: { languages: Language[] }) {
  const settings = useSettings();
  const isClient = useIsClient();

  // Only the languages switched on in Settings → Languages.
  const shown = enabledLanguages(languages, settings);
  // Use the language picked last time, if it's still shown.
  const language =
    shown.find((l) => l.meta.code === settings.practiceLanguage) ?? shown[0];
  const voice = useVoice(language.meta.speechLang);

  // Each new round gets a new number, which starts it fresh.
  const [round, setRound] = useState({ number: 0, mode: "due" as RoundMode });

  function changeLanguage(code: string) {
    updateSettings({ practiceLanguage: code });
    setRound((r) => ({ number: r.number + 1, mode: "due" }));
  }

  function startRound(mode: RoundMode) {
    setRound((r) => ({ number: r.number + 1, mode }));
  }

  return (
    <>
      {/* No picker needed when only one language is switched on. */}
      {shown.length > 1 && (
        <LanguagePicker
          options={shown.map((l) => ({ code: l.meta.code, name: l.meta.name }))}
          value={language.meta.code}
          onChange={changeLanguage}
        />
      )}

      {isClient ? (
        // "key" makes React start a brand-new round whenever the
        // language or round number changes.
        <FlashcardRound
          key={`${language.meta.code}-${round.number}`}
          language={language}
          mode={round.mode}
          voice={voice.status === "ready" ? voice.voice : null}
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

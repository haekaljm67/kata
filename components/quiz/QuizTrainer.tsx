"use client";
// The quiz page: language picker on top, a note if the device can't
// speak the language, then one quiz.

import { useState } from "react";
import { VolumeX } from "lucide-react";
import { LanguagePicker } from "@/components/LanguagePicker";
import { enabledLanguages, updateSettings, useSettings } from "@/lib/settings";
import { useVoice } from "@/lib/speech";
import type { Language } from "@/lib/types";
import { useIsClient } from "@/lib/useIsClient";
import { QuizRound } from "./QuizRound";

export function QuizTrainer({ languages }: { languages: Language[] }) {
  const settings = useSettings();
  const isClient = useIsClient();

  // Only the languages switched on in Settings → Languages. Same
  // language as flashcards: one shared choice for Practice.
  const shown = enabledLanguages(languages, settings);
  const language =
    shown.find((l) => l.meta.code === settings.practiceLanguage) ?? shown[0];
  const voice = useVoice(language.meta.speechLang);

  // Each new quiz gets a new number, which starts it fresh.
  const [quizNumber, setQuizNumber] = useState(0);

  function changeLanguage(code: string) {
    updateSettings({ practiceLanguage: code });
    setQuizNumber((n) => n + 1);
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

      {voice.status === "missing" && (
        <p className="mb-5 flex gap-3 rounded-2xl border border-line bg-surface p-3.5 text-sm leading-relaxed text-muted">
          <VolumeX size={18} className="mt-0.5 shrink-0" aria-hidden />
          <span>
            This device has no {language.meta.name} voice, so listening
            questions are skipped. You can add one in your device&apos;s
            speech settings, or try Chrome.
          </span>
        </p>
      )}

      {/* Wait until we're in the browser and know whether there's a
          voice, so the quiz is built with the right question types. */}
      {isClient && voice.status !== "checking" ? (
        <QuizRound
          key={`${language.meta.code}-${quizNumber}`}
          language={language}
          voice={voice.status === "ready" ? voice.voice : null}
          onNewQuiz={() => setQuizNumber((n) => n + 1)}
        />
      ) : (
        <div className="mt-9 min-h-[14rem] rounded-[2rem] border border-line bg-surface" />
      )}
    </>
  );
}

"use client";
// The quiz page: language picker on top, a note if the device can't
// speak the language, then one quiz.

import { useState } from "react";
import { VolumeX } from "lucide-react";
import { LanguagePicker } from "@/components/LanguagePicker";
import { updatePreferences, usePreferences } from "@/lib/preferences";
import { useVoice } from "@/lib/speech";
import type { Language } from "@/lib/types";
import { useIsClient } from "@/lib/useIsClient";
import { QuizRound } from "./QuizRound";

export function QuizTrainer({ languages }: { languages: Language[] }) {
  const preferences = usePreferences();
  const isClient = useIsClient();

  // Same language as flashcards: one shared choice for Practice.
  const language =
    languages.find((l) => l.meta.code === preferences.practiceLanguage) ??
    languages[0];
  const voice = useVoice(language.meta.speechLang);

  // Each new quiz gets a new number, which starts it fresh.
  const [quizNumber, setQuizNumber] = useState(0);

  function changeLanguage(code: string) {
    updatePreferences({ practiceLanguage: code });
    setQuizNumber((n) => n + 1);
  }

  return (
    <>
      <LanguagePicker
        options={languages.map((l) => ({ code: l.meta.code, name: l.meta.name }))}
        value={language.meta.code}
        onChange={changeLanguage}
      />

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

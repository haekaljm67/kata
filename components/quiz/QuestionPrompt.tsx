"use client";
// The top part of a quiz question: the word, the sound, or the
// sentence with a blank, depending on the question type.

import { Volume2 } from "lucide-react";
import { bigWordSizeClass } from "@/lib/flashcards";
import type { Question } from "@/lib/quiz";
import type { Language } from "@/lib/types";

const LABELS = {
  meaning: "What does this mean?",
  listening: "Which word did you hear?",
  blank: "Fill in the blank",
};

type QuestionPromptProps = {
  question: Question;
  language: Language;
  answered: boolean;
  onPlay: (rate?: number) => void;
};

export function QuestionPrompt({ question, language, answered, onPlay }: QuestionPromptProps) {
  const { word } = question;
  const code = language.meta.code;

  return (
    <div className="flex min-h-[14rem] flex-col items-center justify-center rounded-[2rem] border border-line bg-surface px-6 py-8 text-center shadow-[0_1px_2px_rgb(31_42_46/0.04),0_12px_32px_-16px_rgb(31_42_46/0.18)]">
      <p className="text-xs font-semibold tracking-[0.14em] text-sage-ink uppercase">
        {LABELS[question.type]}
      </p>

      {question.type === "meaning" && (
        <>
          <p
            lang={code}
            className={`mt-4 font-semibold tracking-tight text-balance ${bigWordSizeClass(word.word)}`}
          >
            {word.word}
          </p>
          {/* Kanji words show their kana reading, for kana-first learners. */}
          {word.reading && (
            <p lang={code} className="mt-2 text-muted">
              {word.reading}
            </p>
          )}
        </>
      )}

      {question.type === "listening" && (
        <>
          <button
            type="button"
            onClick={() => onPlay()}
            aria-label="Play the word again"
            className="mt-5 flex size-20 cursor-pointer items-center justify-center rounded-full bg-clay/15 text-clay-ink transition-colors hover:bg-clay/25 focus-visible:ring-2 focus-visible:ring-clay/60 focus-visible:outline-none"
          >
            <Volume2 size={34} strokeWidth={1.8} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => onPlay(0.6)}
            className="mt-3 cursor-pointer rounded-full px-3 py-1.5 text-sm text-muted underline decoration-line underline-offset-4 hover:text-ink"
          >
            Play slower
          </button>
          {/* After answering, show what was said. */}
          {answered && (
            <p lang={code} className="mt-2 text-xl font-semibold">
              {word.word}
            </p>
          )}
        </>
      )}

      {question.type === "blank" && question.blank && (
        <>
          <p lang={code} className="mt-5 text-2xl leading-relaxed font-medium text-balance">
            {question.blank.before}
            {answered ? (
              <span className="text-clay-ink">{question.blank.answer}</span>
            ) : (
              <span
                className="mx-1 inline-block w-16 border-b-2 border-ink/40 align-baseline"
                aria-label="blank"
              >
                &nbsp;
              </span>
            )}
            {question.blank.after}
          </p>
          {word.example.translation && (
            <p className="mt-3 text-sm text-muted italic">{word.example.translation}</p>
          )}
        </>
      )}
    </div>
  );
}

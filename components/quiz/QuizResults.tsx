"use client";
// The end of a quiz: the score, the words to review, and a way to
// practice them.

import Link from "next/link";
import { Mascot } from "@/components/Mascot";
import { RubyText } from "@/components/RubyText";
import { wordMarkup } from "@/lib/ruby";
import type { Question } from "@/lib/quiz";
import type { Language } from "@/lib/types";
import type { Result } from "./QuizRound";

type QuizResultsProps = {
  questions: Question[];
  results: Result[];
  language: Language;
  onNewQuiz: () => void;
};

export function QuizResults({ questions, results, language, onNewQuiz }: QuizResultsProps) {
  const score = results.filter((r) => r.correct).length;
  const toReview = questions.filter((_, i) => !results[i]?.correct).map((q) => q.word);

  const message =
    score === questions.length
      ? "A perfect score. Lovely work."
      : score >= questions.length * 0.7
        ? "Nicely done."
        : "Every miss is a word you'll know soon.";

  const primary =
    "flex h-13 cursor-pointer items-center justify-center rounded-2xl bg-clay font-bold text-on-clay transition-[filter] hover:brightness-105";
  const secondary =
    "flex h-13 cursor-pointer items-center justify-center rounded-2xl border border-line font-semibold transition-colors hover:border-muted/40";

  return (
    <div className="flex flex-col items-center rounded-[2rem] border border-line bg-surface px-6 py-10 text-center">
      <Mascot size={64} />
      <h2 className="mt-4 text-2xl font-bold tracking-tight">Quiz complete</h2>
      <p className="mt-3 text-5xl font-semibold tracking-[-0.03em] tabular-nums">
        {score}
        <span className="text-2xl font-medium text-muted"> / {questions.length}</span>
      </p>
      <p className="mt-2 text-muted">{message}</p>

      {toReview.length > 0 && (
        <div className="mt-7 w-full text-left">
          <p className="text-center text-xs font-semibold tracking-[0.14em] text-sage-ink uppercase">
            Words to review
          </p>
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line">
            {toReview.map((word) => (
              <li key={word.id} className="flex items-baseline justify-between gap-4 px-4 py-3">
                <span lang={language.meta.code} className="font-medium">
                  <RubyText text={wordMarkup(word)} />
                </span>
                <span className="text-right text-sm text-muted">{word.meaning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex w-full flex-col gap-3">
        {toReview.length > 0 ? (
          <>
            {/* Missed words are now first in line in flashcards. */}
            <Link href="/practice/flashcards" className={primary}>
              Practice these in flashcards
            </Link>
            <button type="button" onClick={onNewQuiz} className={secondary}>
              New quiz
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={onNewQuiz} className={primary}>
              New quiz
            </button>
            <Link href="/practice" className={secondary}>
              Back to Practice
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

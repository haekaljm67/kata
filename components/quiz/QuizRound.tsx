"use client";
// One quiz of 10 questions: shows each question, checks the answer,
// explains it, and ends with the results.

import { useEffect, useRef, useState } from "react";
import { Check, Volume2, X } from "lucide-react";
import { getProgress, recordActivity, recordAnswer } from "@/lib/progress";
import {
  buildQuiz,
  explain,
  isTypedAnswerCorrect,
  type Choice,
  type Question,
} from "@/lib/quiz";
import { wordMarkup } from "@/lib/ruby";
import { speak } from "@/lib/speech";
import { RubyText } from "@/components/RubyText";
import type { Language, Word } from "@/lib/types";
import { QuestionPrompt } from "./QuestionPrompt";
import { QuizResults } from "./QuizResults";

export type Result = { correct: boolean; choice: Choice };

type QuizRoundProps = {
  language: Language;
  voice: SpeechSynthesisVoice | null; // null: no voice on this device
  onNewQuiz: () => void;
};

// What the voice reads out. Kanji words use their kana reading, so
// 水 is read as "mizu" and not another way.
const spokenText = (word: Word) => word.reading ?? word.word;

export function QuizRound({ language, voice, onNewQuiz }: QuizRoundProps) {
  // Build the quiz once, when it starts.
  const [questions] = useState<Question[]>(() =>
    buildQuiz(language.words, language.meta, getProgress(), voice !== null),
  );
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [typing, setTyping] = useState(false); // "Type it instead" mode

  const question = questions[index];
  const result = results[index];
  const nextButton = useRef<HTMLButtonElement>(null);

  function answer(choice: Choice) {
    if (!question || result) return;
    const correct =
      "word" in choice
        ? choice.word.id === question.word.id
        : isTypedAnswerCorrect(choice.typed, question.word, question.blank);

    // A wrong answer marks the word "needs practice", so it comes back
    // first in flashcards. A right one only counts toward the streak.
    if (correct) recordActivity();
    else recordAnswer(question.word.id, "missed");

    setResults((r) => {
      const next = [...r];
      next[index] = { correct, choice };
      return next;
    });
  }

  function goNext() {
    setIndex((i) => i + 1);
    setTyping(false);
  }

  // Listening questions play the word as soon as they appear.
  useEffect(() => {
    if (question?.type === "listening" && voice) speak(spokenText(question.word), voice);
  }, [question, voice]);

  // After answering, move to the Next button so the explanation and
  // button are in view, and Enter goes on to the next question.
  useEffect(() => {
    if (!result) return;
    nextButton.current?.focus({ preventScroll: true });
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    nextButton.current?.scrollIntoView({
      block: "nearest",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [result]);

  // Keyboard shortcuts on a computer: 1–4 pick an option.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, select")) return;
      const number = Number(event.key);
      if (!result && !typing && number >= 1 && number <= question?.options.length) {
        answer({ word: question.options[number - 1] });
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (!question) {
    return (
      <QuizResults
        questions={questions}
        results={results}
        language={language}
        onNewQuiz={onNewQuiz}
      />
    );
  }

  const isLast = index === questions.length - 1;
  const answered = results.filter(Boolean).length;
  const canType = question.type === "blank";

  return (
    <div>
      {/* Progress through the quiz. */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className="h-1 flex-1 overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-label="Quiz progress"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={answered}
        >
          <div
            className="h-full rounded-full bg-sage transition-[width] duration-500 motion-reduce:transition-none"
            style={{ width: `${(answered / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-xs font-medium text-muted tabular-nums">
          {index + 1} / {questions.length}
        </p>
      </div>

      <QuestionPrompt
        // A fresh prompt for every question, so hints start hidden again.
        key={index}
        question={question}
        language={language}
        answered={Boolean(result)}
        onPlay={(rate) => voice && speak(spokenText(question.word), voice, rate)}
      />

      {/* The answer area: options, or a text box in "type it" mode. */}
      {typing ? (
        <TypedAnswer language={language} result={result} onSubmit={answer} />
      ) : (
        <ul className="mt-5 space-y-2.5">
          {question.options.map((option, i) => (
            <li key={option.id}>
              <OptionButton
                number={i + 1}
                option={option}
                question={question}
                language={language}
                result={result}
                onPick={() => answer({ word: option })}
              />
            </li>
          ))}
        </ul>
      )}

      {canType && !result && (
        <button
          type="button"
          onClick={() => setTyping((t) => !t)}
          className="mx-auto mt-3 block cursor-pointer rounded-full px-3 py-1.5 text-sm text-muted underline decoration-line underline-offset-4 hover:text-ink"
        >
          {typing ? "Choose from options instead" : "Type it instead"}
        </button>
      )}

      {/* Explanation and Next button, once answered. */}
      {result && (
        <>
          <div
            className={`mt-5 rounded-2xl border p-4 ${
              result.correct ? "border-clay/40 bg-clay/10" : "border-line bg-surface"
            }`}
          >
            <p className="flex items-center gap-2 font-bold">
              {result.correct ? (
                <Check size={18} strokeWidth={2.6} className="text-clay-ink" aria-hidden />
              ) : (
                <X size={18} strokeWidth={2.6} className="text-muted" aria-hidden />
              )}
              {result.correct ? "Correct" : "Not quite"}
            </p>
            {/* role="status" reads the explanation out to screen readers. */}
            <p role="status" className="mt-1.5 leading-relaxed">
              <RubyText text={explain(question, result.choice, result.correct)} />
            </p>
            {voice && question.type !== "listening" && (
              <button
                type="button"
                onClick={() => speak(spokenText(question.word), voice)}
                className="mt-3 flex cursor-pointer items-center gap-1.5 text-sm font-medium text-clay-ink hover:underline"
              >
                <Volume2 size={16} aria-hidden />
                Hear it
              </button>
            )}
          </div>
          <button
            ref={nextButton}
            type="button"
            onClick={goNext}
            // scroll-mb keeps the button clear of the bottom tabs when
            // the page scrolls it into view.
            className="mt-4 h-14 w-full scroll-mb-[calc(6rem+env(safe-area-inset-bottom))] cursor-pointer rounded-2xl bg-clay text-[1.0625rem] font-bold text-on-clay transition-[filter] hover:brightness-105 focus-visible:ring-2 focus-visible:ring-clay/60 focus-visible:ring-offset-2 focus-visible:ring-offset-paper focus-visible:outline-none"
          >
            {isLast ? "See results" : "Next question"}
          </button>
        </>
      )}

      {!result && (
        <p className="mt-4 hidden text-center text-xs text-muted pointer-fine:block">
          Press 1–4 to choose
        </p>
      )}
    </div>
  );
}

/* ---------- One answer option ---------- */

function OptionButton({
  number,
  option,
  question,
  language,
  result,
  onPick,
}: {
  number: number;
  option: Word;
  question: Question;
  language: Language;
  result: Result | undefined;
  onPick: () => void;
}) {
  const isRight = option.id === question.word.id;
  const wasPicked = result && "word" in result.choice && result.choice.word.id === option.id;

  // How the option looks before and after answering.
  let look = "border-line bg-surface hover:border-muted/40 cursor-pointer";
  if (result) {
    if (isRight) look = "border-clay bg-clay text-on-clay";
    else if (wasPicked) look = "border-ink/25 bg-ink/5 text-muted";
    else look = "border-line bg-surface opacity-50";
  }

  // Meaning questions show meanings; the others show the words.
  const showsWord = question.type !== "meaning";

  return (
    <button
      type="button"
      onClick={onPick}
      disabled={Boolean(result)}
      className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors duration-200 ${look}`}
    >
      <span
        className="hidden size-6 shrink-0 items-center justify-center rounded-md border border-current/25 text-xs font-semibold opacity-70 pointer-fine:flex"
        aria-hidden
      >
        {number}
      </span>
      <span
        lang={showsWord ? language.meta.code : undefined}
        className={`flex-1 ${showsWord ? "text-lg font-medium" : "font-medium"}`}
      >
        {showsWord ? <RubyText text={wordMarkup(option)} /> : option.meaning}
      </span>
      {result && isRight && <Check size={20} strokeWidth={2.6} aria-label="Right answer" />}
      {result && wasPicked && !isRight && <X size={20} strokeWidth={2.4} aria-label="Your answer" />}
    </button>
  );
}

/* ---------- Typing the answer (fill in the blank) ---------- */

function TypedAnswer({
  language,
  result,
  onSubmit,
}: {
  language: Language;
  result: Result | undefined;
  onSubmit: (choice: Choice) => void;
}) {
  const [text, setText] = useState("");
  const hint =
    language.meta.code === "ja"
      ? "Type in Japanese or romanization, like “neko”"
      : "Type the missing word";

  return (
    <form
      className="mt-5"
      onSubmit={(event) => {
        event.preventDefault(); // stay on the page
        if (text.trim()) onSubmit({ typed: text });
      }}
    >
      <label htmlFor="typed-answer" className="sr-only">
        Your answer
      </label>
      <div className="flex gap-2">
        <input
          id="typed-answer"
          value={text}
          onChange={(event) => setText(event.target.value)}
          disabled={Boolean(result)}
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder={hint}
          className={`h-14 min-w-0 flex-1 rounded-2xl border bg-surface px-4 text-lg outline-none placeholder:text-base placeholder:text-muted/70 focus:border-clay ${
            result
              ? result.correct
                ? "border-clay text-clay-ink"
                : "border-ink/25 text-muted line-through"
              : "border-line"
          }`}
        />
        {!result && (
          <button
            type="submit"
            className="h-14 cursor-pointer rounded-2xl bg-clay px-5 font-bold text-on-clay transition-[filter] hover:brightness-105"
          >
            Check
          </button>
        )}
      </div>
    </form>
  );
}

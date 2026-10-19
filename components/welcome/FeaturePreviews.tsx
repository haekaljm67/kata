"use client";
// Small previews of the real screens for the welcome page.
//
// They're built from the same parts the Practice pages use (the
// flashcard, the quiz question and its answer options), so they always
// match what learners actually see. They're shrunk with CSS "zoom" and
// made "inert": only for looking at, not for tapping.

import { Flashcard } from "@/components/flashcards/Flashcard";
import { QuestionPrompt } from "@/components/quiz/QuestionPrompt";
import { OptionButton } from "@/components/quiz/QuizRound";
import { RubyText } from "@/components/RubyText";
import { explain, type Question } from "@/lib/quiz";
import type { Language, Word } from "@/lib/types";

// A frame that shrinks a real screen part into a preview.
function Preview({ children, zoom = 0.78 }: { children: React.ReactNode; zoom?: number }) {
  return (
    <div
      inert
      aria-hidden
      className="pointer-events-none mt-4 overflow-hidden lg:mt-0 rounded-[1.75rem] border border-line bg-paper p-4 select-none"
    >
      <div style={{ zoom }}>{children}</div>
    </div>
  );
}

const noop = () => {};

// The back of a flashcard: reading, meaning and an example sentence.
export function FlashcardPreview({ word, language }: { word: Word; language: Language }) {
  return (
    <Preview>
      <Flashcard word={word} language={language.meta} flipped onFlip={noop} />
    </Preview>
  );
}

// An answered multiple choice question, with its explanation.
export function QuizPreview({
  word,
  options,
  language,
}: {
  word: Word;
  options: Word[];
  language: Language;
}) {
  const question: Question = { type: "meaning", word, options };
  const result = { correct: true, choice: { word } };

  return (
    <Preview zoom={0.74}>
      <QuestionPrompt
        question={question}
        language={language}
        answered
        onPlay={noop}
        readings="show"
        canShowReadings={false}
        onShowReadings={noop}
      />
      <ul className="mt-5 space-y-2.5">
        {options.map((option, i) => (
          <li key={option.id}>
            <OptionButton
              number={i + 1}
              option={option}
              question={question}
              language={language}
              result={result}
              readings="show"
              onPick={noop}
            />
          </li>
        ))}
      </ul>
      <div className="mt-5 rounded-2xl border border-clay/40 bg-clay/10 p-4">
        <p className="font-bold">Correct</p>
        <p className="mt-1.5 leading-relaxed">
          <RubyText text={explain(question, result.choice, true)} />
        </p>
      </div>
    </Preview>
  );
}

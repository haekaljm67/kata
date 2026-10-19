"use client";
// One flashcard. The front shows the word big; tapping it flips the
// card over to show the reading, meaning and an example sentence.

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { RubyText, type ReadingsMode } from "@/components/RubyText";
import { bigWordSizeClass } from "@/lib/wordSize";
import { wordMarkup } from "@/lib/ruby";
import { useSettings } from "@/lib/settings";
import type { LanguageMeta, Word } from "@/lib/types";

type FlashcardProps = {
  word: Word;
  language: LanguageMeta;
  flipped: boolean;
  onFlip: () => void;
  onSpeak?: () => void; // missing when the device has no voice
};

// Shared look for both sides of the card. Both sides sit in the same
// grid cell, so the card is always as tall as its taller side.
const FACE =
  "relative col-start-1 row-start-1 flex min-h-[21rem] flex-col items-center justify-center rounded-[2rem] border border-line bg-surface px-6 py-10 text-center shadow-[0_1px_2px_rgb(31_42_46/0.04),0_12px_32px_-16px_rgb(31_42_46/0.18)] backface-hidden";

// An invisible button covering a side of the card, so tapping anywhere
// on it flips the card.
const FLIP_BUTTON =
  "absolute inset-0 cursor-pointer rounded-[2rem] outline-none focus-visible:ring-2 focus-visible:ring-clay/60";

export function Flashcard({ word, language, flipped, onFlip, onSpeak }: FlashcardProps) {
  const code = language.code;
  const { readingHelp } = useSettings();
  // "Show reading" tapped on this card. Each card starts fresh, because
  // the round gives every card its own key.
  const [revealed, setRevealed] = useState(false);

  // Reading help on the front: romanization and readings above kanji.
  const romanization = language.usesRomanization ? word.romanization : undefined;
  const hasHelp = Boolean(romanization) || wordMarkup(word).includes("{");
  const showHelp = readingHelp === "always" || revealed;
  const readings: ReadingsMode = showHelp
    ? "show"
    : readingHelp === "tap"
      ? "hidden" // space kept, so the word doesn't jump when revealed
      : "none";

  return (
    // perspective gives the flip its depth.
    <div className="perspective-[1400px]">
      <div
        className={`grid transition-transform duration-500 ease-out transform-3d motion-reduce:transition-none ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT: the word. "inert" switches this side off while it's
            facing away, so it can't be tapped or reached by keyboard. */}
        <div className={FACE} inert={flipped}>
          <button
            type="button"
            onClick={onFlip}
            className={FLIP_BUTTON}
            aria-label={`${word.word}. Flip the card to see the answer.`}
          />
          <p
            lang={code}
            className={`pointer-events-none font-semibold tracking-tight text-balance ${bigWordSizeClass(word.word)}`}
          >
            {/* Kanji words can show their kana reading above. */}
            <RubyText text={wordMarkup(word)} readings={readings} />
          </p>
          {showHelp && romanization && (
            <p className="pointer-events-none mt-4 text-muted" aria-live="polite">
              {romanization}
            </p>
          )}
          {/* Settings → Reading help → On tap. Sits above the flip
              button, so tapping it doesn't flip the card. */}
          {readingHelp === "tap" && !revealed && hasHelp && (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="relative z-10 mt-5 cursor-pointer rounded-full px-3 py-1.5 text-sm text-muted underline decoration-line decoration-1 underline-offset-4 transition-colors hover:text-ink"
            >
              Show reading
            </button>
          )}
          {/* Hear the word. Only shown when the device has a voice. */}
          {onSpeak && (
            <button
              type="button"
              onClick={onSpeak}
              aria-label="Play the word"
              className="absolute top-4 right-4 z-10 flex size-11 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-clay/10 hover:text-clay-ink focus-visible:ring-2 focus-visible:ring-clay/60 focus-visible:outline-none"
            >
              <Volume2 size={20} strokeWidth={1.8} aria-hidden />
            </button>
          )}
          <p className="pointer-events-none absolute bottom-6 text-xs text-muted">
            Tap to flip
          </p>
        </div>

        {/* BACK: the answer, turned around so it reads correctly after
            the flip. */}
        <div className={`${FACE} rotate-y-180`} inert={!flipped}>
          <button
            type="button"
            onClick={onFlip}
            className={FLIP_BUTTON}
            aria-label="Flip the card back to the word"
          />
          <div className="pointer-events-none flex w-full flex-col items-center">
            {(word.reading || word.romanization) && (
              <p className="text-sm text-muted">
                {word.reading && (
                  <span lang={code} className="text-base text-ink">
                    {word.reading}
                  </span>
                )}
                {word.reading && word.romanization && " · "}
                {word.romanization}
              </p>
            )}
            <p className="mt-2 text-[1.75rem] leading-tight font-semibold tracking-tight text-balance">
              {word.meaning}
            </p>
            <p className="mt-2 text-xs font-semibold tracking-[0.14em] text-sage-ink uppercase">
              {word.partOfSpeech}
            </p>

            <div className="mt-7 w-full border-t border-line pt-6">
              <p lang={code} className="text-lg leading-relaxed text-balance">
                <RubyText text={word.example.text} />
              </p>
              {word.example.romanization && (
                <p className="mt-1 text-sm text-muted">
                  {word.example.romanization}
                </p>
              )}
              {word.example.translation && (
                <p className="mt-2 text-sm text-muted italic">
                  {word.example.translation}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
// One round of flashcards: shows each card, records Missed / Know,
// brings missed cards back a little later, and ends with a summary.

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Mascot } from "@/components/Mascot";
import { RubyText } from "@/components/RubyText";
import { wordMarkup } from "@/lib/ruby";
import {
  buildRound,
  MISSED_CARD_GAP,
  type RoundMode,
} from "@/lib/flashcards";
import { dayKey, getProgress, recordAnswer } from "@/lib/progress";
import type { Language, Word } from "@/lib/types";
import { Flashcard } from "./Flashcard";

type Answer = "know" | "missed";

type RoundState = {
  queue: Word[]; // cards still to go; the first one is showing
  total: number; // how many different words this round has
  firstAnswers: Record<string, Answer>; // each word's first answer
  answerCount: number; // answers so far, used to tell cards apart
};

type FlashcardRoundProps = {
  language: Language;
  mode: RoundMode;
  onStartRound: (mode: RoundMode) => void;
};

export function FlashcardRound({ language, mode, onStartRound }: FlashcardRoundProps) {
  // Pick the cards once, when the round starts.
  const [state, setState] = useState<RoundState>(() => {
    const cards = buildRound(language.words, getProgress(), dayKey(), mode);
    return { queue: cards, total: cards.length, firstAnswers: {}, answerCount: 0 };
  });
  const [flipped, setFlipped] = useState(false);

  const current = state.queue[0];

  function answer(result: Answer) {
    if (!current) return;
    recordAnswer(current.id, result);

    setState((s) => {
      const rest = s.queue.slice(1);
      // A missed card goes back into the pile a few cards later.
      if (result === "missed") {
        rest.splice(Math.min(MISSED_CARD_GAP, rest.length), 0, current);
      }
      return {
        queue: rest,
        total: s.total,
        // Only the first answer counts for the summary.
        firstAnswers:
          current.id in s.firstAnswers
            ? s.firstAnswers
            : { ...s.firstAnswers, [current.id]: result },
        answerCount: s.answerCount + 1,
      };
    });
    setFlipped(false);
  }

  // Keyboard shortcuts on a computer:
  // Space flips the card, ← means Missed, → means Know.
  useEffect(() => {
    if (!current) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement;
      // In the language picker, arrow keys switch language, so leave
      // every key to it.
      if (target.closest("input, textarea, select")) return;
      // Buttons and links already use Space to press themselves.
      const onButton = target.closest("button, a");

      if (event.key === " " && !onButton) {
        event.preventDefault(); // stop the page from scrolling
        setFlipped((f) => !f);
      } else if (event.key === "ArrowLeft") {
        answer("missed");
      } else if (event.key === "ArrowRight") {
        answer("know");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // Nothing to practice right now.
  if (state.total === 0) {
    return <CaughtUp mode={mode} onStartRound={onStartRound} />;
  }

  // Every card has been answered with Know.
  if (!current) {
    return <RoundSummary state={state} language={language} onStartRound={onStartRound} />;
  }

  // How many different words are fully done (no longer in the pile).
  const remaining = new Set(state.queue.map((w) => w.id)).size;
  const done = state.total - remaining;

  return (
    <div>
      {/* Progress through the round. */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className="h-1 flex-1 overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-label="Round progress"
          aria-valuemin={0}
          aria-valuemax={state.total}
          aria-valuenow={done}
        >
          <div
            className="h-full rounded-full bg-sage transition-[width] duration-500 motion-reduce:transition-none"
            style={{ width: `${(done / state.total) * 100}%` }}
          />
        </div>
        <p className="text-xs font-medium text-muted tabular-nums">
          {done} / {state.total}
        </p>
      </div>

      {/* "key" gives every card a fresh start, so the next card appears
          front side up instead of flipping back over. */}
      <Flashcard
        key={`${current.id}-${state.answerCount}`}
        word={current}
        language={language.meta}
        flipped={flipped}
        onFlip={() => setFlipped((f) => !f)}
      />

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => answer("missed")}
          className="flex h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-line bg-surface text-[1.1875rem] font-bold transition-colors hover:border-muted/40 active:scale-[0.98] motion-reduce:active:scale-100"
        >
          <RotateCcw size={18} strokeWidth={2.2} aria-hidden />
          Missed
        </button>
        <button
          type="button"
          onClick={() => answer("know")}
          className="flex h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-clay text-[1.1875rem] font-bold text-on-clay transition-[filter] hover:brightness-105 active:scale-[0.98] motion-reduce:active:scale-100"
        >
          <Check size={20} strokeWidth={2.4} aria-hidden />
          Know
        </button>
      </div>

      {/* Only shown on devices with a mouse, where shortcuts make sense. */}
      <p className="mt-4 hidden text-center text-xs text-muted pointer-fine:block">
        Space to flip · ← Missed · → Know
      </p>
    </div>
  );
}

/* ---------- End of round ---------- */

function RoundSummary({
  state,
  language,
  onStartRound,
}: {
  state: RoundState;
  language: Language;
  onStartRound: (mode: RoundMode) => void;
}) {
  const knew = Object.values(state.firstAnswers).filter((a) => a === "know").length;
  const missedWords = language.words.filter(
    (w) => state.firstAnswers[w.id] === "missed",
  );

  return (
    <div className="flex flex-col items-center rounded-[2rem] border border-line bg-surface px-6 py-10 text-center">
      <Mascot size={64} />
      <h2 className="mt-4 text-2xl font-bold tracking-tight">Round complete</h2>
      <p className="mt-2 text-muted">
        You knew <span className="font-semibold text-ink">{knew}</span> of{" "}
        {state.total} on the first try.
      </p>

      {missedWords.length > 0 && (
        <div className="mt-6 w-full">
          <p className="text-xs font-semibold tracking-[0.14em] text-sage-ink uppercase">
            Coming back soon
          </p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {missedWords.map((w) => (
              <li
                key={w.id}
                lang={language.meta.code}
                className="rounded-full border border-line px-3 py-1 text-sm"
              >
                <RubyText text={wordMarkup(w)} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex w-full flex-col gap-3">
        <button
          type="button"
          onClick={() => onStartRound("due")}
          className="h-13 cursor-pointer rounded-2xl bg-clay font-bold text-on-clay transition-[filter] hover:brightness-105"
        >
          Practice again
        </button>
        <Link
          href="/practice"
          className="flex h-13 items-center justify-center rounded-2xl border border-line font-semibold transition-colors hover:border-muted/40"
        >
          Back to Practice
        </Link>
      </div>
    </div>
  );
}

/* ---------- Nothing due ---------- */

function CaughtUp({
  mode,
  onStartRound,
}: {
  mode: RoundMode;
  onStartRound: (mode: RoundMode) => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-[2rem] border border-line bg-surface px-6 py-10 text-center">
      <Mascot size={64} />
      <h2 className="mt-4 text-2xl font-bold tracking-tight">All caught up</h2>
      <p className="mt-2 max-w-xs leading-relaxed text-muted">
        {mode === "due"
          ? "You've seen every word in this language, and none are due yet. They'll come back when it's time."
          : "There's nothing left to review right now. Come back tomorrow."}
      </p>
      {mode === "due" && (
        <button
          type="button"
          onClick={() => onStartRound("extra")}
          className="mt-8 h-13 w-full cursor-pointer rounded-2xl border border-line font-semibold transition-colors hover:border-muted/40"
        >
          Review anyway
        </button>
      )}
    </div>
  );
}

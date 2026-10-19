import type { Metadata } from "next";
import { Mascot } from "@/components/Mascot";
import { RubyText } from "@/components/RubyText";
import { FlashcardPreview, QuizPreview } from "@/components/welcome/FeaturePreviews";
import { StartLearning } from "@/components/welcome/StartLearning";
import { getLanguages } from "@/lib/content";
import { bigWordSizeClass } from "@/lib/wordSize";
import { wordMarkup } from "@/lib/ruby";
import type { Language, Word } from "@/lib/types";

export const metadata: Metadata = { title: "Welcome" };

// The welcome page. Shown on a first visit to Today (see the early
// script in lib/appearance.ts), and always reachable at /welcome and
// from Settings → About Kata. The bottom tabs are hidden here.

// Finds a word by id in a language.
function find(language: Language | undefined, id: string): Word | undefined {
  return language?.words.find((w) => w.id === id);
}

export default function WelcomePage() {
  const languages = getLanguages();
  const byCode = (code: string) => languages.find((l) => l.meta.code === code);

  // Real words for the previews of the actual screens.
  const japanese = byCode("ja");
  const indonesian = byCode("id");
  const flashcardWord = find(japanese, "ja-hon");
  const quizWord = find(indonesian, "id-kucing");
  const quizOptions = ["id-kucing", "id-anjing", "id-buku", "id-rumah"]
    .map((id) => find(indonesian, id))
    .filter((w): w is Word => Boolean(w));

  return (
    <div className="space-y-14 pb-4">
      {/* 1. What Kata is */}
      <section>
        <Mascot size={64} />
        <h1 className="mt-5 text-[2.25rem] leading-[1.1] font-bold tracking-[-0.03em]">
          One word at a time.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Kata is a small, quiet place to learn words in English, Indonesian
          and Japanese. You see one word at a time, and the ones you miss come
          back until they stick.
        </p>
      </section>

      {/* 2. The languages, each with a real word from its flashcards */}
      <section aria-labelledby="languages-heading">
        <h2 id="languages-heading" className="text-xl font-bold tracking-tight">
          Three languages to start
        </h2>
        <p className="mt-1.5 leading-relaxed text-muted">
          Beginner words first: CEFR A1 for English and Indonesian, JLPT N5
          for Japanese.
        </p>
        <ul className="mt-5 space-y-3">
          {languages.map(({ meta, words }) => {
            const sample = words.find((w) => w.id === meta.sampleWord) ?? words[0];
            if (!sample) return null;
            return (
              <li
                key={meta.code}
                className="flex min-h-36 flex-col rounded-3xl border border-line bg-surface px-5 pt-4 pb-6 shadow-[0_1px_2px_rgb(31_42_46/0.04),0_12px_32px_-16px_rgb(31_42_46/0.18)]"
              >
                <p className="text-xs font-semibold tracking-[0.14em] text-sage-ink uppercase">
                  {meta.name}
                </p>
                {/* The word as it looks on the front of a flashcard. */}
                <p
                  lang={meta.code}
                  className={`flex flex-1 items-center justify-center pt-2 font-semibold tracking-tight ${bigWordSizeClass(sample.word)}`}
                >
                  <RubyText text={wordMarkup(sample)} />
                </p>
                <p className="text-center text-sm text-muted">{sample.meaning}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 3. What you can do, with previews of the real screens */}
      <section aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-xl font-bold tracking-tight">
          What you can do
        </h2>

        <div className="mt-6">
          <h3 className="font-semibold">Flashcards</h3>
          <p className="mt-1 leading-relaxed text-muted">
            Flip a card, then say whether you knew it. Words you miss come back
            in the same round; words you know wait a few days before they
            return.
          </p>
          {flashcardWord && japanese && (
            <FlashcardPreview word={flashcardWord} language={japanese} />
          )}
        </div>

        <div className="mt-10">
          <h3 className="font-semibold">Quizzes</h3>
          <p className="mt-1 leading-relaxed text-muted">
            Multiple choice, listening and fill in the blank. Every answer
            comes with a short note that teaches you something about the word.
          </p>
          {quizWord && indonesian && quizOptions.length > 1 && (
            <QuizPreview word={quizWord} options={quizOptions} language={indonesian} />
          )}
        </div>

        {/* Not built yet: no preview, just a quiet label. */}
        <ul className="mt-10 divide-y divide-line border-y border-line">
          <ComingSoon
            name="Writing practice"
            text="Trace each stroke with a start dot and an arrow, then write on your own."
          />
          <ComingSoon
            name="Conversation practice"
            text="Short scripted conversations for everyday phrases."
          />
        </ul>
      </section>

      {/* 4. How it works */}
      <section aria-labelledby="how-heading">
        <h2 id="how-heading" className="text-xl font-bold tracking-tight">
          How it works
        </h2>
        <ol className="mt-5 space-y-4">
          <Step number={1} title="Pick a language">
            Choose one at the top of Practice. You can switch any time.
          </Step>
          <Step number={2} title="Practice a little each day">
            Ten words a day is a good start. A word counts as learned once
            you&apos;ve known it on two different days.
          </Step>
          <Step number={3} title="Watch your words add up">
            Your streak and word counts are on the Profile tab.
          </Step>
        </ol>
      </section>

      {/* 5. Start */}
      <section>
        <StartLearning />
        <p className="mt-3 text-center text-sm text-muted">
          No account needed. Your progress stays in this browser.
        </p>
      </section>
    </div>
  );
}

function ComingSoon({ name, text }: { name: string; text: string }) {
  return (
    <li className="flex items-start justify-between gap-4 py-4">
      <div>
        <p className="font-semibold">{name}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-muted">{text}</p>
      </div>
      <span className="mt-0.5 shrink-0 rounded-full border border-line px-2.5 py-1 text-[0.6875rem] font-medium whitespace-nowrap text-muted">
        Coming soon
      </span>
    </li>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sm font-semibold text-sage-ink"
      >
        {number}
      </span>
      <div className="pt-1">
        <p className="font-semibold">{title}</p>
        <p className="mt-0.5 leading-relaxed text-muted">{children}</p>
      </div>
    </li>
  );
}

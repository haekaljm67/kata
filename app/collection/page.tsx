import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { getLanguages } from "@/lib/content";

export const metadata: Metadata = { title: "Collection" };

// The Collection tab. For now it lists each language and its words,
// read straight from the files in content/languages. A new language
// folder shows up here automatically.

export default function CollectionPage() {
  const languages = getLanguages();

  return (
    <>
      <PageHeader
        eyebrow="Collection"
        title="Your words"
        intro="Every word you meet is kept here, grouped by language."
      />
      <div className="space-y-8">
        {languages.map(({ meta, words }) => (
          <section key={meta.code} aria-labelledby={`lang-${meta.code}`}>
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h2
                id={`lang-${meta.code}`}
                className="text-xl font-semibold tracking-tight"
              >
                {meta.name}
              </h2>
              <p className="text-xs font-medium tracking-wide text-muted">
                {meta.framework} {meta.startLevel} · {words.length}{" "}
                {words.length === 1 ? "word" : "words"}
              </p>
            </div>
            <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
              {words.map((word) => (
                // lang= tells the browser (and screen readers) which
                // language the word is in, so it picks the right font
                // and pronunciation.
                <li
                  key={word.id}
                  className="flex items-center justify-between gap-4 px-4 py-3.5"
                >
                  {/* Left: the word, with its reading underneath. */}
                  <div className="shrink-0">
                    <p
                      lang={meta.code}
                      className="text-lg font-medium whitespace-nowrap"
                    >
                      {word.word}
                    </p>
                    {(word.reading || word.romanization) && (
                      <p className="mt-0.5 text-sm text-muted">
                        {[word.reading, word.romanization]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                  {/* Right: the meaning, which wraps if it's long. */}
                  <p className="text-right text-sm text-muted">{word.meaning}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

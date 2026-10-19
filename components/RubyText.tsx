// Shows text with furigana: readings in small kana above kanji.
// See lib/ruby.ts for how readings are written in content files.
// <ruby> and <rt> are the browser's built-in tags for this.

import { parseRuby } from "@/lib/ruby";

export function RubyText({ text }: { text: string }) {
  return (
    <>
      {parseRuby(text).map((part, i) =>
        typeof part === "string" ? (
          part
        ) : (
          <ruby key={i}>
            {part.base}
            <rt>{part.reading}</rt>
          </ruby>
        ),
      )}
    </>
  );
}

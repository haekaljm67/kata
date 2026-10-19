// Shows text with furigana: readings in small kana above kanji.
// See lib/ruby.ts for how readings are written in content files.
// <ruby> and <rt> are the browser's built-in tags for this.

import { parseRuby } from "@/lib/ruby";

// How readings are shown (Settings → Reading help):
// - "show"    readings above kanji
// - "hidden"  space kept, reading invisible (so nothing shifts when it
//             appears after "Show reading" is tapped)
// - "none"    no readings at all, just the kanji
export type ReadingsMode = "show" | "hidden" | "none";

export function RubyText({
  text,
  readings = "show",
}: {
  text: string;
  readings?: ReadingsMode;
}) {
  return (
    <>
      {parseRuby(text).map((part, i) => {
        if (typeof part === "string") return part;
        if (readings === "none") return part.base;
        return (
          <ruby key={i}>
            {part.base}
            <rt className={readings === "hidden" ? "invisible" : undefined}>
              {part.reading}
            </rt>
          </ruby>
        );
      })}
    </>
  );
}

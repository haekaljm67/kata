# Kata lesson content

All lesson content lives here as plain data files. The site finds every
language folder by itself, so you never need to change code to add one.

```
content/
  languages/
    en/   English     (CEFR)
    id/   Indonesian  (CEFR)
    ja/   Japanese    (JLPT)
```

Each language folder has two files:

- **language.json** holds facts about the language: its name, level system and voice code.
- **words.json** holds the vocabulary, as a list of words.

## Adding a new language

1. Copy an existing folder, for example `id`, and rename the copy to the new language code (`fr` for French).
2. In `language.json`, change `code` to match the folder name, then update the name, levels and `speechLang` (for example `fr-FR`). Set `sampleWord` to the id of the word shown for this language on the welcome page.
3. Replace the words in `words.json`.
4. Restart the site. The new language appears automatically.

## Fields in words.json

| Field          | Required | What it is                                                                   |
| -------------- | -------- | ---------------------------------------------------------------------------- |
| `id`           | yes      | Unique name, language code first: `fr-bonjour`. Never change it later, because saved progress uses it. |
| `word`         | yes      | The word shown big on the flashcard.                                         |
| `reading`      | no       | Kana reading, for Japanese words written in kanji.                           |
| `romanization` | no       | Latin-letter spelling, shown as an optional hint.                            |
| `meaning`      | yes      | Meaning in English.                                                          |
| `partOfSpeech` | yes      | noun, verb, greeting, expression…                                            |
| `level`        | yes      | Must be one of the levels listed in `language.json`.                         |
| `example`      | yes      | `text`, optional `romanization`, and an English `translation` (leave it out for English). |
| `audio`        | yes      | `null` to use the browser's voice, or `{ "url", "credit", "license" }` for a native recording. |
| `nativeCheck`  | yes      | `"needed"` until a native speaker has reviewed the word, then `"done"`.     |
| `teach`        | yes      | Short teaching notes shown after quiz answers. See below.                    |

## Readings above kanji (furigana)

Japanese words with a `reading` get it shown above the kanji automatically.
In example sentences and notes, write a kanji with its reading like this:

```
{友|とも}だちと{話|はな}します。
```

The part before `|` is the kanji, the part after it is the reading.

## Teaching notes (`teach`)

Every quiz answer gets an explanation that teaches **one useful thing**,
instead of repeating the answer. Each word has:

| Field                 | Used for           | What to write                                                          |
| --------------------- | ------------------ | ---------------------------------------------------------------------- |
| `meaning`             | Multiple choice    | Something useful about using the word: politeness, plurals, opposites. |
| `sound`               | Listening          | Something useful about saying the word: long vowels, silent letters.   |
| `blank.tip`           | Fill in the blank  | The clue in the example sentence that points to the answer.            |
| `blank.wrongOptions`  | Fill in the blank  | Ids of 2–3 words that clearly do **not** fit the sentence.             |

Leave out `blank` when the example sentence has no clear clue. Without the
English translation (hidden until the learner answers), the sentence alone
must rule out every wrong option, so a quiz never has two right answers.
For example, `うちに＿がいます` can't offer ねこ as a wrong option for いぬ,
because "We have a cat at home" is also correct.

Notes that a native speaker should double-check are listed in `REVIEW.md`.

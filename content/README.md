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
2. In `language.json`, change `code` to match the folder name, then update the name, levels and `speechLang` (for example `fr-FR`).
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

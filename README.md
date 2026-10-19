# Kata

**A calm, mobile-first website for learning English, Indonesian and Japanese, one word at a time.**

Kata is a portfolio project: a language learning site for beginners at mixed levels,
designed to feel quiet and premium rather than loud and gamified. It works without an
account, follows your device's light or dark setting, and keeps your progress in your
own browser.

## What it does

- **Flashcards with spaced repetition.** One big word per card, tap to flip, then *Missed* or *Know*.
  Missed words come back in the same round; known words come back after 1, 3, 7, 14 and 30 days.
  A word only counts as mastered after it's answered correctly on two different days.
- **Quizzes** that mix multiple choice, listening and fill-in-the-blank questions. Every answer gets a
  short explanation that teaches one useful thing, such as why います is used for animals and あります for objects.
- **Readings above kanji** (furigana) everywhere Japanese appears, so learners still on kana can read every word.
- **Listening** with the browser's built-in text-to-speech. If a device has no voice for a language, the
  quiz says so and skips those questions instead of failing silently.
- **Progress** on this device: a daily streak, a daily word goal, plus counts of words being learned, mastered and needing practice.
- **Settings** for theme (with no flash on load), text size, animations, daily goal, reading help, languages,
  autoplay, speech speed and sound effects. Every setting controls something that already works.

Levels follow real frameworks: CEFR (A1) for English and Indonesian, and JLPT (N5) for Japanese.

## Design choices

- **Content is data, not code.** Each language is a folder of JSON files, so French, German, Mandarin and
  Dutch can be added later without touching the code. See [`content/README.md`](content/README.md).
- **One correct answer, always.** Fill-in-the-blank questions use hand-picked wrong options that the
  sentence itself rules out, so a blank never has two valid answers.
- **Honest content.** All lessons were written without a native speaker so far. Every word is marked
  for review, and [`content/REVIEW.md`](content/REVIEW.md) lists the notes I'm least sure about.
- **Calm visual style.** Off-white, ink, sage and clay; Plus Jakarta Sans and Zen Kaku Gothic New; a small
  ink-drop mascot used sparingly. Accessible contrast in both light and dark mode.

## Built with

[Next.js](https://nextjs.org) · [Tailwind CSS](https://tailwindcss.com) · [Lucide](https://lucide.dev) icons ·
Google Fonts (Open Font License). Built with the help of [Claude Code](https://claude.com/claude-code).

## Run it locally

You need [Node.js](https://nodejs.org) installed.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

> **Windows tip:** if PowerShell says running scripts is disabled, type `npm.cmd` instead of `npm`.

While developing, a small **Dev** button in the corner can pretend it's the next day, to test spaced
repetition and streaks. It's left out of the live site automatically.

## Project structure

| Folder               | What's inside                                                       |
| -------------------- | ------------------------------------------------------------------- |
| `app/`               | One folder per page. `app/globals.css` holds the colors and fonts.  |
| `components/`        | Reusable pieces: navigation, flashcards, quiz, mascot.              |
| `content/languages/` | Lesson content, one folder per language.                            |
| `lib/`               | The rules: spaced repetition, quiz building, saving progress, speech. |

## Status

Work in progress. Coming next: writing practice, a lesson path, a placement test, scripted conversation
practice, a "word of the hour", native audio recordings, and optional accounts to sync progress.

# Kata, a language learning website

## About me
- I'm Haekal and a complete beginner at coding. Explain technical steps in plain language, one step at a time, and tell me exactly what to type or click.
- This is a portfolio piece. Quality matters more than speed, and there's no deadline.
- Budget is zero. Only suggest free tools and free tiers.

## What we're building
- Kata is an interactive language learning website (a website, not an app) for students at mixed levels.
- The interface is in English.
- Launch languages: English, Indonesian, Japanese. French, German, Mandarin and Dutch come later, so structure content so new languages can be added without rebuilding the site.
- Levels follow known frameworks: CEFR for English and Indonesian, JLPT for Japanese. Start with beginner content (A1 / N5).

## Features for the first version
- Flashcards with spaced repetition. One big word per card, tap to flip, two answer buttons (Missed / Know), optional romanization hint. A word counts as mastered only after it's answered correctly on two different days.
- Quizzes (multiple choice, listening, fill in the blank). Every answer gets a short explanation of why it's right or wrong.
- Writing practice with Guided and Free-form modes. Guided shows a start dot and arrow for each stroke. Japanese starts with a kana-first foundations path.
- Lesson path as a vertical list with locked lessons grayed out and a "Start here" marker on the next one.
- Optional placement test so learners can skip what they already know.
- Chat partner: scripted conversation practice for now, no paid AI API.
- "Word of the hour" card on the Today page: reading, meaning, an example sentence and audio.
- Progress: word milestones (10, 50, 100, 200, 500), a daily streak with weekday dots, and counts for learning / mastered / needs practice.
- Works without an account. Signing up saves progress (free option such as Supabase).

## Content and audio
- You write the lesson content. Keep it accurate and natural, and flag anything a native speaker should double-check.
- Audio: use free, properly licensed native recordings where they exist (e.g. Tatoeba, Lingua Libre) and credit them. Otherwise use the browser's built-in text-to-speech.

## Design
- Calm and premium, with a little warmth. It must not look cheap, templated, or like generic AI-made design. No ads, no clutter.
- Mobile-first. Bottom navigation on phones with four tabs: Today, Practice, Collection, Profile.
- Light and dark mode, following the device setting by default.
- Reference: Hourly Kana (iOS app). Borrow its structure and clarity: big single words on clean cards, the practice hub, the lesson path, the progress screens. Don't copy its loud colors, its fonts, or its mascot.
- Colors: off-white #F7F5F0, ink #1F2A2E, sage #7A9E8E, clay #C8795A (main accent for buttons and correct answers), line #E4E0D8
- A simple original mascot: a small rounded ink drop with dot eyes, in ink #1F2A2E with clay or sage accents. Used sparingly: empty states, streaks, milestones, and the favicon.

## Build and hosting
- Built with Claude Code, hosted free on Vercel.
- Keep the code simple and well commented so I can follow it.

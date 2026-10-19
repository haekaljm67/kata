# Kata

An interactive language learning website for English, Indonesian and Japanese, built mobile-first.

## Run it on your computer

1. Open a terminal in this folder.
2. Type `npm.cmd run dev` and press Enter. (On this Windows computer, plain `npm` is blocked in PowerShell by a security setting. `npm.cmd` is the same command and works without changing anything.)
3. Open http://localhost:3000 in your browser.

To stop the site, click the terminal and press `Ctrl + C`.

## Where things live

| Folder               | What's inside                                                  |
| -------------------- | -------------------------------------------------------------- |
| `app/`               | One folder per page. `app/globals.css` holds colors and fonts. |
| `components/`        | Reusable pieces such as the bottom navigation and the mascot.  |
| `content/languages/` | Lesson content, one folder per language. See `content/README.md`. |
| `lib/`               | Helper code: reading content, saving progress.                 |

## Built with

Next.js, Tailwind CSS and Lucide icons. Fonts: Fraunces, Figtree and Zen Kaku Gothic New (Google Fonts, Open Font License).

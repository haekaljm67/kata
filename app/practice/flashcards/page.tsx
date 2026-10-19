import type { Metadata } from "next";
import { FlashcardTrainer } from "@/components/flashcards/FlashcardTrainer";
import { getLanguages } from "@/lib/content";

export const metadata: Metadata = { title: "Flashcards" };

// The flashcards page. It reads every language's words from the
// content files and hands them to the flashcard trainer.

export default function FlashcardsPage() {
  const languages = getLanguages();

  return (
    <>
      {/* The back arrow to Practice is in the top bar (components/TopBar.tsx). */}
      <h1 className="mb-5 text-2xl font-bold tracking-tight">Flashcards</h1>
      <FlashcardTrainer languages={languages} />
    </>
  );
}

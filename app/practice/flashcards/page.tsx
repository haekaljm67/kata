import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { FlashcardTrainer } from "@/components/flashcards/FlashcardTrainer";
import { getLanguages } from "@/lib/content";

export const metadata: Metadata = { title: "Flashcards" };

// The flashcards page. It reads every language's words from the
// content files and hands them to the flashcard trainer.

export default function FlashcardsPage() {
  const languages = getLanguages();

  return (
    <>
      <header className="mb-5 flex items-center gap-1">
        <Link
          href="/practice"
          aria-label="Back to Practice"
          className="-ml-2.5 flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:text-ink"
        >
          <ChevronLeft size={24} strokeWidth={2} aria-hidden />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Flashcards</h1>
      </header>
      <FlashcardTrainer languages={languages} />
    </>
  );
}

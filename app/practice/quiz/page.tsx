import type { Metadata } from "next";
import { QuizTrainer } from "@/components/quiz/QuizTrainer";
import { getLanguages } from "@/lib/content";

export const metadata: Metadata = { title: "Quiz" };

// The quiz page. It reads every language's words from the content
// files and hands them to the quiz.

export default function QuizPage() {
  const languages = getLanguages();

  return (
    <>
      {/* The back arrow to Practice is in the top bar (components/TopBar.tsx). */}
      <h1 className="mb-5 text-2xl font-bold tracking-tight">Quiz</h1>
      <QuizTrainer languages={languages} />
    </>
  );
}

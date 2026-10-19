import type { Metadata } from "next";
import {
  Layers,
  ListChecks,
  MessageCircle,
  PenLine,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Practice" };

// The Practice tab. Each mode is listed but not built yet.

type Mode = {
  name: string;
  description: string;
  icon: LucideIcon;
};

const MODES: Mode[] = [
  {
    name: "Flashcards",
    description: "One word at a time. Flip, then say if you knew it.",
    icon: Layers,
  },
  {
    name: "Quizzes",
    description: "Multiple choice, listening and fill in the blank.",
    icon: ListChecks,
  },
  {
    name: "Writing",
    description: "Trace each stroke, then write on your own.",
    icon: PenLine,
  },
  {
    name: "Chat partner",
    description: "Practice short, everyday conversations.",
    icon: MessageCircle,
  },
];

export default function PracticePage() {
  return (
    <>
      <PageHeader
        eyebrow="Practice"
        title="Choose how to practice"
        intro="Every mode uses the words from your lessons."
      />
      <ul className="space-y-3">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          return (
            <li
              key={mode.name}
              className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sage/15 text-sage-ink">
                <Icon size={22} strokeWidth={1.8} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-medium">{mode.name}</h2>
                <p className="mt-0.5 text-sm leading-snug text-muted">
                  {mode.description}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-muted">
                Soon
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}

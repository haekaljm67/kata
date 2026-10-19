import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Layers,
  ListChecks,
  MessageCircle,
  PenLine,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Practice" };

// The Practice tab. Modes with an "href" are ready and open their
// page; the others are marked "Soon".

type Mode = {
  name: string;
  description: string;
  icon: LucideIcon;
  href?: string;
};

const MODES: Mode[] = [
  {
    name: "Flashcards",
    description: "One word at a time. Flip, then say if you knew it.",
    icon: Layers,
    href: "/practice/flashcards",
  },
  {
    name: "Quiz",
    description: "Multiple choice, listening and fill in the blank.",
    icon: ListChecks,
    href: "/practice/quiz",
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
      <ul className="grid gap-3 lg:grid-cols-2">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const content = (
            <>
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sage/15 text-sage-ink">
                <Icon size={22} strokeWidth={1.8} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold">{mode.name}</h2>
                <p className="mt-0.5 text-sm leading-snug text-muted">
                  {mode.description}
                </p>
              </div>
            </>
          );
          const cardStyle =
            "flex h-full items-center gap-4 rounded-2xl border border-line bg-surface p-4";

          return (
            <li key={mode.name}>
              {mode.href ? (
                // A ready mode: the whole card is a link.
                <Link
                  href={mode.href}
                  className={`${cardStyle} transition-colors hover:border-muted/40 focus-visible:ring-2 focus-visible:ring-clay/60 focus-visible:outline-none`}
                >
                  {content}
                  <ChevronRight
                    size={20}
                    className="shrink-0 text-muted"
                    aria-hidden
                  />
                </Link>
              ) : (
                <div className={cardStyle}>
                  {content}
                  <span className="shrink-0 rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-muted">
                    Soon
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

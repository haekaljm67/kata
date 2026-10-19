import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProgressSummary } from "@/components/ProgressSummary";

export const metadata: Metadata = { title: "Profile" };

// The Profile tab: your streak, daily goal and word counts, and the
// way into Settings. Milestones and sign-up come later.

export default function ProfilePage() {
  return (
    <>
      <PageHeader eyebrow="Profile" title="Your progress" />
      <ProgressSummary />

      <Link
        href="/profile/settings"
        className="mt-8 flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-muted/40 focus-visible:ring-2 focus-visible:ring-clay/60 focus-visible:outline-none"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sage/15 text-sage-ink">
          <SlidersHorizontal size={20} strokeWidth={1.8} aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">Settings</span>
          <span className="block text-sm text-muted">
            Theme, daily goal, reading help, audio and more
          </span>
        </span>
        <ChevronRight size={20} className="shrink-0 text-muted" aria-hidden />
      </Link>
    </>
  );
}

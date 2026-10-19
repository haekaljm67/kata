"use client";
// The main content area of every page: the top bar, then the page.
// It picks a comfortable width for the page (see pageWidthClass in
// lib/navigation.ts): narrow for one-task pages like Flashcards, wider
// on desktop for pages with more to show.

import { usePathname } from "next/navigation";
import { pageWidthClass } from "@/lib/navigation";
import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main
      className={`app-main mx-auto w-full min-w-0 px-5 sm:px-8 lg:px-12 ${pageWidthClass(pathname)}`}
    >
      {/* Mascot home button, or a back arrow on deeper pages. */}
      <TopBar />
      {children}
    </main>
  );
}

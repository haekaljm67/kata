"use client";
// The navigation on desktop (lg screens and up): the mascot logo, then
// the four sections in a quiet column on the left. On phones and
// tablets the bottom tabs are used instead (components/BottomNav.tsx).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { hasNavigation, isActive, TABS } from "@/lib/navigation";
import { Mascot } from "./Mascot";

export function Sidebar() {
  const pathname = usePathname();
  if (!hasNavigation(pathname)) return null;

  return (
    // "sticky" keeps it in place while the page scrolls.
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line px-5 py-8 lg:flex">
      <Link
        href="/"
        aria-label="Kata home"
        className="-ml-1 inline-flex min-h-11 items-center gap-2.5 self-start rounded-full px-1 outline-none focus-visible:ring-2 focus-visible:ring-clay/60"
      >
        <Mascot size={30} />
        <span className="text-xl font-bold tracking-tight">Kata</span>
      </Link>

      <nav aria-label="Main" className="mt-10">
        <ul className="space-y-1">
          {TABS.map((tab) => {
            const active = isActive(pathname, tab.href);
            const Icon = tab.icon;
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-[0.9375rem] font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-clay/60 ${
                    active
                      ? "bg-clay/12 text-clay-ink"
                      : "text-muted hover:bg-ink/[0.04] hover:text-ink"
                  }`}
                >
                  <Icon size={20} strokeWidth={active ? 2.1 : 1.7} aria-hidden />
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

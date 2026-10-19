"use client";
// "use client" means this component runs in the browser. It needs to,
// because it checks which page you're on to highlight the right tab.

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CircleUserRound,
  Layers,
  Sun,
  type LucideIcon,
} from "lucide-react";

type Tab = {
  label: string;
  href: string;
  icon: LucideIcon;
};

// The four tabs, in order. To rename a tab or change its icon, edit it here.
const TABS: Tab[] = [
  { label: "Today", href: "/", icon: Sun },
  { label: "Practice", href: "/practice", icon: Layers },
  { label: "Collection", href: "/collection", icon: BookOpen },
  { label: "Profile", href: "/profile", icon: CircleUserRound },
];

// A tab is active when you're on its page or a page inside it
// (for example /practice/flashcards keeps "Practice" highlighted).
function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="bottom-nav fixed inset-x-0 bottom-0 z-10 border-t border-line bg-paper/90 backdrop-blur-md"
    >
      <ul className="mx-auto grid max-w-xl grid-cols-4">
        {TABS.map((tab) => {
          const active = isActive(pathname, tab.href);
          const Icon = tab.icon;

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                // Tells screen readers which tab is the current page.
                aria-current={active ? "page" : undefined}
                className="group flex min-h-16 flex-col items-center justify-center gap-1 pt-2 pb-1.5 outline-none focus-visible:ring-2 focus-visible:ring-clay/60 focus-visible:ring-inset"
              >
                {/* The icon sits in a soft clay "pill" when its tab is active. */}
                <span
                  className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-200 ${
                    active
                      ? "bg-clay/15 text-clay"
                      : "text-muted group-hover:text-ink"
                  }`}
                >
                  <Icon size={20} strokeWidth={active ? 2.1 : 1.7} aria-hidden />
                </span>
                <span
                  className={`text-[0.6875rem] font-medium tracking-wide transition-colors duration-200 ${
                    active ? "text-clay-ink" : "text-muted group-hover:text-ink"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

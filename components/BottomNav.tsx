"use client";
// The bottom tabs on phones and tablets. On desktop (lg and up) the
// sidebar takes over (components/Sidebar.tsx).
// "use client" means this component runs in the browser. It needs to,
// because it checks which page you're on to highlight the right tab.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { hasNavigation, isActive, TABS } from "@/lib/navigation";

export function BottomNav() {
  const pathname = usePathname();

  // No tabs on the welcome page: it ends with its own "Start learning".
  if (!hasNavigation(pathname)) return null;

  return (
    <nav
      aria-label="Main"
      className="bottom-nav fixed inset-x-0 bottom-0 z-10 border-t border-line bg-paper/90 backdrop-blur-md lg:hidden"
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

// The site's four main sections and page widths, shared by the bottom
// tabs (phones and tablets), the sidebar (desktop) and the page layout.

import {
  BookOpen,
  CircleUserRound,
  Layers,
  Sun,
  type LucideIcon,
} from "lucide-react";

export type Tab = {
  label: string;
  href: string;
  icon: LucideIcon;
};

// The four sections, in order. To rename one or change its icon, edit it here.
export const TABS: Tab[] = [
  { label: "Today", href: "/", icon: Sun },
  { label: "Practice", href: "/practice", icon: Layers },
  { label: "Collection", href: "/collection", icon: BookOpen },
  { label: "Profile", href: "/profile", icon: CircleUserRound },
];

// A section is active when you're on its page or a page inside it
// (for example /practice/flashcards keeps "Practice" highlighted).
export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Pages that show a back arrow in the top bar, and where it goes.
// These are also "focus" pages: one task at a time, in a narrow column.
export const BACK_LINKS: Record<string, { href: string; label: string }> = {
  "/practice/flashcards": { href: "/practice", label: "Back to Practice" },
  "/practice/quiz": { href: "/practice", label: "Back to Practice" },
  "/profile/settings": { href: "/profile", label: "Back to Profile" },
};

// The welcome page has no tabs or sidebar: it ends with "Start learning".
export const hasNavigation = (pathname: string) => pathname !== "/welcome";

// How wide a page's content can get on large screens. Phones always
// use the full width; these limits matter from tablet size up.
export function pageWidthClass(pathname: string): string {
  if (BACK_LINKS[pathname]) return "max-w-xl lg:max-w-[40rem]"; // focus pages
  if (pathname === "/welcome") return "max-w-xl lg:max-w-5xl"; // room for side-by-side sections
  return "max-w-xl lg:max-w-3xl"; // everything else: 768px on desktop
}

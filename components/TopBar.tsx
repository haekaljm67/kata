"use client";
// The small row at the top-left of every page.
// - Usually: the ink drop mascot and "Kata", which goes to Today
//   (on the welcome page it scrolls back to the top instead).
// - On pages one level down (Flashcards, Quiz, Settings): a back arrow
//   to the page they belong to.
// It sits in the normal page flow (not floating), so it never covers
// page content or headings.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Settings as Gear } from "lucide-react";
import { prefersReducedMotion } from "@/lib/appearance";
import { BACK_LINKS, hasNavigation, SETTINGS_HREF } from "@/lib/navigation";
import { Mascot } from "./Mascot";

// At least 44×44 pixels, so it's easy to tap on a phone.
const TAP_TARGET =
  "-ml-2.5 inline-flex min-h-11 min-w-11 items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-clay/60";

export function TopBar() {
  const pathname = usePathname();
  const back = BACK_LINKS[pathname];

  let content;
  if (back) {
    content = (
      <Link
        href={back.href}
        aria-label={back.label}
        className={`${TAP_TARGET} justify-center text-muted transition-colors hover:text-ink`}
      >
        <ChevronLeft size={24} strokeWidth={2} aria-hidden />
      </Link>
    );
  } else {
    const logo = (
      <>
        <Mascot size={26} />
        <span className="text-[1.0625rem] font-bold tracking-tight">Kata</span>
      </>
    );
    const look = `${TAP_TARGET} gap-2 px-2.5`;

    content =
      pathname === "/welcome" ? (
        // On the welcome page, go back to the top of it.
        <button
          type="button"
          aria-label="Kata home"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })
          }
          className={`${look} cursor-pointer`}
        >
          {logo}
        </button>
      ) : (
        <Link href="/" aria-label="Kata home" className={look}>
          {logo}
        </Link>
      );
  }

  // On desktop the sidebar already shows the logo, so a row holding
  // only the logo is hidden there. Back arrows always stay.
  const logoOnly = !back && hasNavigation(pathname);
  // On desktop, Settings is opened from the gear in the sidebar, so it
  // needs no back arrow there either.
  const hideOnDesktop = logoOnly || pathname === SETTINGS_HREF;

  // Phones and tablets: a gear in the top-right corner opens Settings.
  // (Desktop has the gear at the bottom of the sidebar instead.) Not
  // shown on the Settings page itself or on the welcome page.
  const showGear = hasNavigation(pathname) && pathname !== SETTINGS_HREF;

  return (
    <div
      className={`mb-5 flex h-11 items-center justify-between ${hideOnDesktop ? "lg:hidden" : ""}`}
    >
      {content}
      {showGear && (
        <Link
          href={SETTINGS_HREF}
          aria-label="Settings"
          className="-mr-2.5 inline-flex size-11 items-center justify-center rounded-full text-muted transition-colors outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-clay/60 lg:hidden"
        >
          <Gear size={22} strokeWidth={1.8} aria-hidden />
        </Link>
      )}
    </div>
  );
}

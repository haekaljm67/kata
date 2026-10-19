import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Zen_Kaku_Gothic_New } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

/*
  FONTS
  Next.js downloads these free Google Fonts when the site is built and
  serves them from our own site, so visitors never connect to Google.
*/

// Plus Jakarta Sans: all interface text, including headings.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
});

// Zen Kaku Gothic New: a calm Japanese font.
// Japanese fonts are large, so we don't preload them. The browser only
// downloads the characters a page actually uses.
const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-zen-kaku",
  preload: false,
});

// The title and description shown in browser tabs and search results.
export const metadata: Metadata = {
  title: {
    default: "Kata",
    template: "%s · Kata",
  },
  description:
    "Learn English, Indonesian and Japanese, one word at a time.",
};

// Phone screen settings: draw edge to edge, and tint the browser bar
// to match the page in light and dark mode.
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f0" },
    { media: "(prefers-color-scheme: dark)", color: "#161d20" },
  ],
};

// This layout wraps every page: the page content in a centered
// column, with the bottom navigation underneath.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${zenKaku.variable} antialiased`}
    >
      <body className="min-h-dvh bg-paper font-sans text-ink">
        <main className="app-main mx-auto w-full max-w-xl px-5 sm:px-8">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}

// Kata's clock. Everything that needs "now" or "today" asks here.
//
// While developing on your own computer, the clock can be moved forward
// by whole days (see components/DevDayControls.tsx) to test things like
// the two-day mastery rule. On the live site this is switched off
// completely: Next.js replaces process.env.NODE_ENV with "production"
// when it builds the site, so the offset code is never used there.

const IS_DEV = process.env.NODE_ENV === "development";
const OFFSET_KEY = "kata.dev.dayOffset";

// How many days the developer has moved the clock forward.
export function getDevDayOffset(): number {
  if (!IS_DEV || typeof window === "undefined") return 0;
  try {
    return Number(window.localStorage.getItem(OFFSET_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function setDevDayOffset(days: number) {
  if (!IS_DEV) return;
  try {
    if (days === 0) window.localStorage.removeItem(OFFSET_KEY);
    else window.localStorage.setItem(OFFSET_KEY, String(days));
  } catch {
    // Storage blocked: the offset just won't stick.
  }
}

// The current date and time (moved forward in development, if set).
export function now(): Date {
  const date = new Date();
  const offset = getDevDayOffset();
  if (offset) date.setDate(date.getDate() + offset);
  return date;
}

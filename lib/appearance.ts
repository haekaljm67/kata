// Applies the Appearance settings (theme, text size, motion) to the page.
//
// They work through attributes on the <html> tag, which globals.css
// reacts to:  data-theme="light|dark", data-text-size="large",
// data-motion="reduce". No attribute means "follow the device".
//
// To avoid a flash of the wrong theme, APPEARANCE_SCRIPT runs before
// the page is drawn (see app/layout.tsx). applyAppearance() does the
// same job later, when a setting changes. Keep the two in step.

// Only the type is imported from settings, and storageKeys has no
// browser-only code, so app/layout.tsx (which runs on the server) can
// safely use APPEARANCE_SCRIPT from this file.
import type { Settings } from "./settings";
import { SETTINGS_KEY } from "./storageKeys";

// Browser bar colors (the "theme-color"), matching --kata-paper.
const BAR_LIGHT = "#f7f5f0";
const BAR_DARK = "#161d20";

export function applyAppearance(settings: Settings) {
  const root = document.documentElement;
  setAttribute(root, "data-theme", settings.theme === "system" ? null : settings.theme);
  setAttribute(root, "data-text-size", settings.textSize === "large" ? "large" : null);
  setAttribute(root, "data-motion", settings.motion === "reduce" ? "reduce" : null);
  updateBarColor(settings.theme);
}

function setAttribute(element: HTMLElement, name: string, value: string | null) {
  if (value === null) element.removeAttribute(name);
  else element.setAttribute(name, value);
}

// The page has two theme-color tags: one for light devices, one for
// dark. With a fixed theme, both get that theme's color.
function updateBarColor(theme: Settings["theme"]) {
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    const forDarkDevices = (meta.getAttribute("media") ?? "").includes("dark");
    const dark = theme === "dark" || (theme === "system" && forDarkDevices);
    meta.setAttribute("content", dark ? BAR_DARK : BAR_LIGHT);
  });
}

// Should animations be skipped? True if the device asks for less
// motion (and the learner hasn't overridden it) or the learner chose
// "Off" in Settings.
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return (
    document.documentElement.getAttribute("data-motion") === "reduce" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// The same as applyAppearance, as plain JavaScript text. app/layout.tsx
// puts it at the top of the page so it runs before anything is drawn.
// It's wrapped in try/catch so a blocked or damaged save never breaks
// the page; the device settings are used instead.
export const APPEARANCE_SCRIPT = `(function () {
  try {
    var s = JSON.parse(localStorage.getItem(${JSON.stringify(SETTINGS_KEY)}) || "{}") || {};
    var root = document.documentElement;
    if (s.theme === "light" || s.theme === "dark") root.setAttribute("data-theme", s.theme);
    if (s.textSize === "large") root.setAttribute("data-text-size", "large");
    if (s.motion === "reduce") root.setAttribute("data-motion", "reduce");
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) {
      var forDark = (metas[i].getAttribute("media") || "").indexOf("dark") > -1;
      var dark = s.theme === "dark" || (s.theme !== "light" && forDark);
      metas[i].setAttribute("content", dark ? "${BAR_DARK}" : "${BAR_LIGHT}");
    }
  } catch (e) {}
})();`;

"use client";
// Keeps the page's theme, text size and motion in step with Settings.
// The first paint is handled by the script in app/layout.tsx; this
// takes over afterwards, so changes apply instantly without a reload.

import { useEffect } from "react";
import { applyAppearance } from "@/lib/appearance";
import { useSettings } from "@/lib/settings";
import { useIsClient } from "@/lib/useIsClient";

export function AppearanceSync() {
  const settings = useSettings();
  const isClient = useIsClient();

  useEffect(() => {
    // On the very first render React uses the default settings, before
    // the saved ones are read. Waiting for isClient avoids briefly
    // undoing what the early script already set.
    if (isClient) applyAppearance(settings);
  }, [settings, isClient]);

  return null;
}

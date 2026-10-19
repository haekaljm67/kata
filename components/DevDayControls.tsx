"use client";
// DEVELOPER ONLY. A small "Dev" pill in the bottom-right corner that can
// pretend it's a later day (for testing spaced repetition, streaks and
// the two-day mastery rule) and show the welcome page again.
//
// app/layout.tsx only includes this while developing (npm run dev).
// It is left out of the live site entirely.

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getDevDayOffset, setDevDayOffset } from "@/lib/clock";
import { WELCOMED_KEY } from "@/lib/storageKeys";
import { useIsClient } from "@/lib/useIsClient";

// When the live site is built, this line becomes "() => null", and the
// real control below is dropped from the site's code entirely.
export const DevDayControls =
  process.env.NODE_ENV === "development" ? DevDayControlsPanel : () => null;

function DevDayControlsPanel() {
  const isClient = useIsClient();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // The offset is stored in the browser, so wait until we're there.
  if (!isClient) return null;
  const offset = getDevDayOffset();

  // Reloading makes every page pick up the new "today" cleanly.
  function change(days: number) {
    setDevDayOffset(days);
    window.location.reload();
  }

  const button =
    "cursor-pointer rounded-full px-2.5 py-1 hover:bg-white/15";

  return (
    <div
      // Bottom-right, just above the tabs, out of the way of page headers.
      className="fixed right-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-50 flex items-center gap-1 rounded-full bg-[#1f2a2e] p-1 font-mono text-[11px] text-[#f7f5f0] shadow-lg"
      aria-label="Developer tools"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={button}
        title="Developer only: pretend it's a later day"
      >
        {offset ? `Day +${offset}` : "Dev"}
      </button>
      {open && (
        <>
          <button type="button" onClick={() => change(offset + 1)} className={button}>
            Next day
          </button>
          {offset > 0 && (
            <button type="button" onClick={() => change(0)} className={button}>
              Back to today
            </button>
          )}
          {/* Forget that "Start learning" was tapped, and open the
              welcome page, to test it again. */}
          <button
            type="button"
            onClick={() => {
              window.localStorage.removeItem(WELCOMED_KEY);
              router.push("/welcome");
            }}
            className={button}
          >
            Show welcome again
          </button>
        </>
      )}
    </div>
  );
}

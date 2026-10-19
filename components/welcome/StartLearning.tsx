"use client";
// The "Start learning" button at the end of the welcome page.
// It remembers that the visitor has seen the welcome page, so their
// next visits open Today straight away, then goes to Today.

import { useRouter } from "next/navigation";
import { WELCOMED_KEY } from "@/lib/storageKeys";

export function StartLearning() {
  const router = useRouter();

  function start() {
    try {
      window.localStorage.setItem(WELCOMED_KEY, "yes");
    } catch {
      // Storage blocked: they'll just see the welcome page again next time.
    }
    router.push("/");
  }

  return (
    <button
      type="button"
      onClick={start}
      className="h-14 w-full cursor-pointer rounded-2xl bg-clay text-[1.0625rem] font-bold text-on-clay transition-[filter] hover:brightness-105 focus-visible:ring-2 focus-visible:ring-clay/60 focus-visible:ring-offset-2 focus-visible:ring-offset-paper focus-visible:outline-none"
    >
      Start learning
    </button>
  );
}

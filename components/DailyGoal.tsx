"use client";
// Progress toward today's goal (Settings → Daily goal): how many
// different words were practiced today, with a thin progress bar.

import { useProgress, wordsPracticedToday } from "@/lib/progress";
import { useSettings } from "@/lib/settings";

export function DailyGoal({ compact = false }: { compact?: boolean }) {
  const progress = useProgress();
  const { dailyGoal } = useSettings();
  const done = wordsPracticedToday(progress);
  const reached = done >= dailyGoal;

  return (
    <div className={compact ? "w-full" : "rounded-3xl border border-line bg-surface p-6"}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm text-muted">
          {reached ? "Daily goal reached" : "Today's goal"}
        </p>
        <p className="text-sm text-muted tabular-nums">
          <span className="font-semibold text-ink">{Math.min(done, 999)}</span> / {dailyGoal} words
        </p>
      </div>
      <div
        className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-label="Daily goal"
        aria-valuemin={0}
        aria-valuemax={dailyGoal}
        aria-valuenow={Math.min(done, dailyGoal)}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none ${
            reached ? "bg-clay" : "bg-sage"
          }`}
          style={{ width: `${Math.min(done / dailyGoal, 1) * 100}%` }}
        />
      </div>
    </div>
  );
}

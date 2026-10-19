"use client";
// Shows the learner's saved progress. Runs in the browser because the
// progress is stored there.

import { countByStatus, getStreak, useProgress } from "@/lib/progress";

export function ProgressSummary() {
  const progress = useProgress();
  const counts = countByStatus(progress);
  const streak = getStreak(progress.activeDays);

  const stats = [
    { label: "Learning", value: counts.learning },
    { label: "Mastered", value: counts.mastered },
    { label: "Needs practice", value: counts.needsPractice },
  ];

  return (
    <section aria-labelledby="progress-heading" className="space-y-4">
      <h2 id="progress-heading" className="sr-only">
        Your progress
      </h2>

      <div className="rounded-3xl border border-line bg-surface p-6">
        <p className="text-sm text-muted">Daily streak</p>
        <p className="mt-1 text-5xl font-semibold tracking-[-0.03em] tabular-nums">
          {streak}
          <span className="ml-2 font-sans text-base font-normal text-muted">
            {streak === 1 ? "day" : "days"}
          </span>
        </p>
      </div>

      <dl className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            // flex + justify-between keeps the numbers lined up along the
            // bottom, even when a label wraps onto two lines.
            className="flex flex-col justify-between gap-2 rounded-2xl border border-line bg-surface px-4 py-4"
          >
            <dt className="text-xs leading-snug text-muted">{stat.label}</dt>
            <dd className="text-3xl font-semibold tracking-tight tabular-nums">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="text-sm leading-relaxed text-muted">
        Your progress is saved in this browser. Accounts to keep it safe
        across devices are coming later.
      </p>
    </section>
  );
}

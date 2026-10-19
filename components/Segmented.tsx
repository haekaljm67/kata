"use client";
// A row of choices where exactly one is picked (a "segmented control"),
// used for the language picker and most settings.
//
// Built from real radio buttons, so it works with a keyboard (arrow
// keys move between choices) and screen readers out of the box. The
// circles are hidden and the labels are styled as one pill-shaped bar.

import { useId } from "react";

export type SegmentedOption<T extends string | number> = {
  value: T;
  label: string;
};

type SegmentedProps<T extends string | number> = {
  label: string; // read out by screen readers
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
  className = "",
}: SegmentedProps<T>) {
  // A unique group name, so several controls on one page don't mix.
  const name = useId();

  return (
    <fieldset className={className}>
      <legend className="sr-only">{label}</legend>
      <div className="flex rounded-2xl border border-line bg-surface p-1">
        {options.map((option) => (
          <label
            key={option.value}
            className="relative flex-1 cursor-pointer rounded-xl px-2 py-2.5 text-center text-sm font-medium text-muted transition-colors duration-200 hover:text-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:ring-2 has-focus-visible:ring-clay/60"
          >
            <input
              type="radio"
              name={name}
              value={String(option.value)}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

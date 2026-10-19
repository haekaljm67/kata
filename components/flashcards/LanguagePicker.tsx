"use client";
// The row of languages at the top of the flashcards page.
// Built from real radio buttons, so it works with a keyboard and
// screen readers out of the box. The circles are hidden and the
// labels are styled as a segmented control.

type Option = { code: string; name: string };

type LanguagePickerProps = {
  options: Option[];
  value: string;
  onChange: (code: string) => void;
};

export function LanguagePicker({ options, value, onChange }: LanguagePickerProps) {
  return (
    <fieldset className="mb-5">
      <legend className="sr-only">Language</legend>
      <div className="flex rounded-2xl border border-line bg-surface p-1">
        {options.map((option) => (
          <label
            key={option.code}
            className="relative flex-1 cursor-pointer rounded-xl px-2 py-2.5 text-center text-sm font-medium text-muted transition-colors duration-200 hover:text-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:ring-2 has-focus-visible:ring-clay/60"
          >
            <input
              type="radio"
              name="flashcard-language"
              value={option.code}
              checked={option.code === value}
              onChange={() => onChange(option.code)}
              className="sr-only"
            />
            {option.name}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

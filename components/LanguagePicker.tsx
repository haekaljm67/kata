"use client";
// The row of languages at the top of the Practice pages
// (flashcards and quizzes share the same choice).

import { Segmented } from "./Segmented";

type Option = { code: string; name: string };

type LanguagePickerProps = {
  options: Option[];
  value: string;
  onChange: (code: string) => void;
};

export function LanguagePicker({ options, value, onChange }: LanguagePickerProps) {
  return (
    <Segmented
      label="Language"
      options={options.map((o) => ({ value: o.code, label: o.name }))}
      value={value}
      onChange={onChange}
      className="mb-5"
    />
  );
}

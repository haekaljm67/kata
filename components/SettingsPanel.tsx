"use client";
// The Settings section on the Profile page. Every change is saved in
// this browser straight away and applies immediately.
//
// Rule for this page: only add settings for features that exist.

import { useState } from "react";
import { resetProgress } from "@/lib/progress";
import { updateSettings, useSettings, type Settings } from "@/lib/settings";
import { Segmented } from "./Segmented";
import { Switch } from "./Switch";

type SettingsPanelProps = {
  languages: { code: string; name: string }[];
  version: string;
};

export function SettingsPanel({ languages, version }: SettingsPanelProps) {
  const settings = useSettings();

  // Which languages are on. null in settings means "all of them".
  const enabled = settings.languages ?? languages.map((l) => l.code);
  function toggleLanguage(code: string, on: boolean) {
    const next = on ? [...enabled, code] : enabled.filter((c) => c !== code);
    // Keep the same order as the language list.
    const ordered = languages.map((l) => l.code).filter((c) => next.includes(c));
    updateSettings({ languages: ordered.length === languages.length ? null : ordered });
  }

  // Shortcut for one-setting changes.
  const set = <K extends keyof Settings>(key: K) => (value: Settings[K]) =>
    updateSettings({ [key]: value } as Partial<Settings>);

  return (
    <section aria-labelledby="settings-heading" className="mt-12">
      <h2 id="settings-heading" className="text-2xl font-bold tracking-tight">
        Settings
      </h2>

      <Group title="Appearance">
        <Row label="Theme">
          <Segmented
            label="Theme"
            value={settings.theme}
            onChange={set("theme")}
            options={[
              { value: "system", label: "System" },
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
        </Row>
        <Row label="Text size">
          <Segmented
            label="Text size"
            value={settings.textSize}
            onChange={set("textSize")}
            options={[
              { value: "default", label: "Default" },
              { value: "large", label: "Large" },
            ]}
          />
        </Row>
        <Row
          label="Animations"
          hint="“Match device” follows your device's reduce motion setting. “Off” stops all animations."
        >
          <Segmented
            label="Animations"
            value={settings.motion}
            onChange={set("motion")}
            options={[
              { value: "system", label: "Match device" },
              { value: "reduce", label: "Off" },
            ]}
          />
        </Row>
      </Group>

      <Group title="Learning">
        <Row label="Daily goal" hint="Different words to practice each day, in flashcards or quizzes.">
          <Segmented
            label="Daily goal"
            value={settings.dailyGoal}
            onChange={set("dailyGoal")}
            options={[
              { value: 5, label: "5 words" },
              { value: 10, label: "10 words" },
              { value: 20, label: "20 words" },
            ]}
          />
        </Row>
        <Row
          label="Reading help"
          hint="Romanization and the readings above kanji, before you answer in flashcards and quizzes."
        >
          <Segmented
            label="Reading help"
            value={settings.readingHelp}
            onChange={set("readingHelp")}
            options={[
              { value: "always", label: "Always" },
              { value: "tap", label: "On tap" },
              { value: "never", label: "Never" },
            ]}
          />
        </Row>
        <Row label="Languages" hint="Which languages appear in Practice. At least one stays on.">
          <ul className="divide-y divide-line">
            {languages.map((language) => {
              const on = enabled.includes(language.code);
              const isLastOn = on && enabled.length === 1;
              return (
                <li key={language.code} className="flex items-center justify-between py-2.5">
                  <span>{language.name}</span>
                  <Switch
                    label={language.name}
                    checked={on}
                    disabled={isLastOn}
                    onChange={(value) => toggleLanguage(language.code, value)}
                  />
                </li>
              );
            })}
          </ul>
        </Row>
      </Group>

      <Group title="Audio">
        <SwitchRow
          label="Autoplay"
          hint="Say each word out loud when its flashcard appears."
          checked={settings.autoplay}
          onChange={set("autoplay")}
        />
        <Row label="Speech speed">
          <Segmented
            label="Speech speed"
            value={settings.speechSpeed}
            onChange={set("speechSpeed")}
            options={[
              { value: "normal", label: "Normal" },
              { value: "slow", label: "Slow" },
            ]}
          />
        </Row>
        <SwitchRow
          label="Sound effects"
          hint="Soft tones for right and wrong answers."
          checked={settings.soundEffects}
          onChange={set("soundEffects")}
        />
      </Group>

      <Group title="Your data">
        <ResetProgress />
      </Group>

      <Group title="About">
        <div className="space-y-3 px-5 py-4 text-sm leading-relaxed text-muted">
          <p className="text-ink">Your progress is saved in this browser.</p>
          <dl className="space-y-2">
            <Credit term="Words and examples">
              Written for Kata, awaiting review by native speakers.
            </Credit>
            <Credit term="Audio">
              Spoken by your browser&apos;s built-in voices. No recordings are used yet.
            </Credit>
            <Credit term="Fonts">
              Plus Jakarta Sans and Zen Kaku Gothic New, under the SIL Open Font License.
            </Credit>
            <Credit term="Icons">Lucide, under the ISC License.</Credit>
          </dl>
          <p>Version {version}</p>
        </div>
      </Group>
    </section>
  );
}

/* ---------- Layout pieces ---------- */

// A titled card holding a few settings, separated by thin lines.
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="mb-2 px-1 text-xs font-semibold tracking-[0.14em] text-sage-ink uppercase">
        {title}
      </h3>
      <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {children}
      </div>
    </div>
  );
}

// One setting: its name (and an optional explanation) above the control.
function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-5 py-4">
      <p className="font-medium">{label}</p>
      {hint && <p className="mt-0.5 text-sm leading-snug text-muted">{hint}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

// An on/off setting: name and explanation on the left, switch on the right.
function SwitchRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div>
        <p className="font-medium">{label}</p>
        <p className="mt-0.5 text-sm leading-snug text-muted">{hint}</p>
      </div>
      <Switch label={label} checked={checked} onChange={onChange} />
    </div>
  );
}

function Credit({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-medium text-ink">{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}

/* ---------- Reset progress, with a confirmation step ---------- */

function ResetProgress() {
  const [step, setStep] = useState<"idle" | "confirm" | "done">("idle");

  if (step === "confirm") {
    return (
      <div className="px-5 py-4" role="alertdialog" aria-labelledby="reset-question">
        <p id="reset-question" className="font-medium">
          Reset all progress?
        </p>
        <p className="mt-0.5 text-sm leading-snug text-muted">
          This deletes your streak and all word progress in this browser. It can&apos;t
          be undone. Your settings stay as they are.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setStep("idle")}
            autoFocus
            className="h-12 cursor-pointer rounded-xl border border-line font-semibold transition-colors hover:border-muted/40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              resetProgress();
              setStep("done");
            }}
            className="h-12 cursor-pointer rounded-xl bg-ink font-semibold text-paper transition-opacity hover:opacity-90"
          >
            Reset
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div>
        <p className="font-medium">Reset progress</p>
        <p className="mt-0.5 text-sm leading-snug text-muted" aria-live="polite">
          {step === "done"
            ? "Your progress has been reset."
            : "Start over with a clean streak and no saved words."}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setStep("confirm")}
        className="h-10 shrink-0 cursor-pointer rounded-xl border border-line px-4 text-sm font-semibold transition-colors hover:border-muted/40"
      >
        Reset…
      </button>
    </div>
  );
}

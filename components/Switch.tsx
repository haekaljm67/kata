"use client";
// An on/off switch. role="switch" tells screen readers it's a toggle
// and whether it's on.

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string; // read out by screen readers
  disabled?: boolean;
};

export function Switch({ checked, onChange, label, disabled = false }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-clay/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none ${
        checked ? "bg-clay" : "bg-line"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      {/* The knob slides right when the switch is on. */}
      <span
        aria-hidden
        className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

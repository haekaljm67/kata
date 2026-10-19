// Kata's mascot: a small rounded ink drop with dot eyes and clay cheeks.
// Use it sparingly: empty states, streaks and milestones.
//
// In light mode the drop is ink. In dark mode it switches to the warm
// off-white text color so it doesn't disappear into the dark page.

type MascotProps = {
  size?: number;
  className?: string;
};

export function Mascot({ size = 56, className = "" }: MascotProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
    >
      {/* The drop. */}
      <path
        d="M16 2.5C16 2.5 6 13.7 6 20.8a10 10 0 0 0 20 0C26 13.7 16 2.5 16 2.5Z"
        fill="var(--kata-ink)"
      />
      {/* Eyes, in the page color so they read as "cut out" of the drop. */}
      <circle cx="12.6" cy="20.2" r="1.6" fill="var(--kata-paper)" />
      <circle cx="19.4" cy="20.2" r="1.6" fill="var(--kata-paper)" />
      {/* Cheeks. */}
      <circle cx="10.6" cy="23.6" r="1.3" fill="var(--kata-clay)" opacity="0.85" />
      <circle cx="21.4" cy="23.6" r="1.3" fill="var(--kata-clay)" opacity="0.85" />
    </svg>
  );
}

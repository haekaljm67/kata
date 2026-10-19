import { Mascot } from "./Mascot";

// A gentle card with the mascot, for places that have nothing to show yet.

type EmptyStateProps = {
  title: string;
  children: React.ReactNode;
};

export function EmptyState({ title, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-line bg-surface px-6 py-10 text-center">
      <Mascot size={56} />
      <h2 className="mt-4 font-display text-xl font-medium">{title}</h2>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
        {children}
      </p>
    </div>
  );
}

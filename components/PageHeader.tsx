// The title block at the top of each tab: a small label, a large
// heading, and an optional line of introduction underneath.

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  intro?: string;
};

export function PageHeader({ eyebrow, title, intro }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <p className="text-xs font-semibold tracking-[0.16em] text-sage-ink uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-2 font-display text-[2.5rem] leading-[1.05] font-medium tracking-tight">
        {title}
      </h1>
      {intro && (
        <p className="mt-3 max-w-prose leading-relaxed text-muted">{intro}</p>
      )}
    </header>
  );
}

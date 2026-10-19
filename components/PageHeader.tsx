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
      <h1 className="mt-2 text-[2.25rem] leading-[1.1] font-bold tracking-[-0.03em]">
        {title}
      </h1>
      {intro && (
        <p className="mt-3 max-w-prose leading-relaxed text-muted">{intro}</p>
      )}
    </header>
  );
}

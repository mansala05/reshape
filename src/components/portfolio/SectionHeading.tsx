export function SectionHeading({
  code,
  kicker,
  title,
  children,
  wideDescription = false,
}: {
  code: string;
  kicker: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  wideDescription?: boolean;
}) {
  return (
    <div data-reveal className="grid gap-6 border-t border-border pt-6 md:grid-cols-12">
      <div className="flex items-start font-mono text-xs uppercase tracking-[0.14em] md:col-span-3">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-poppy/40 bg-poppy/10 py-1.5 pl-2.5 pr-4 text-foreground">
          <span className="h-2 w-2 shrink-0 rounded-full bg-poppy-bright animate-pulse-dot" />
          <span className="text-poppy-bright">{code}</span>
          <span className="text-muted-foreground">{kicker}</span>
        </div>
      </div>
      <div className="md:col-span-9">
        <h2 className="text-balance-tight text-4xl font-semibold leading-[0.95] md:text-6xl">
          {title}
        </h2>
        {children && (
          <div
            className={`mt-5 text-muted-foreground ${wideDescription ? "max-w-none" : "max-w-2xl"}`}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

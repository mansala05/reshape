import { sectionCode, stack } from "@/data/portfolio";
import { SectionHeading } from "./SectionHeading";

export function TechStack() {
  return (
    <section id="craft" className="relative scroll-mt-20 px-5 py-28 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          code={sectionCode("craft")}
          kicker="Tech Stack"
          title={
            <>
              The tools behind what I{" "}
              <span className="font-serif font-normal italic text-powder">build</span>.
            </>
          }
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
          {stack.map((group) => (
            <div key={group.id} data-reveal className="bg-background p-7 md:p-9">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-2xl font-semibold tracking-tight">{group.title}</h3>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-powder/60">
                  {group.code}/{String(group.tools.length).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">{group.blurb}</p>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {group.tools.map((tool) => (
                  <li
                    key={tool.name}
                    className="inline-flex items-center gap-2 rounded-full border border-powder/25 bg-surface/70 px-3.5 py-1.5 text-sm text-foreground transition duration-300 hover:border-powder/60 hover:glow-powder"
                  >
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-poppy-bright" />
                    {tool.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

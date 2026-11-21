import { Sparkles } from "lucide-react";

import { about, profile, sectionCode } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

function CropMarks() {
  const mark = "absolute h-4 w-4 border-powder/50";
  return (
    <>
      <span className={cn(mark, "left-3 top-3 border-l border-t")} />
      <span className={cn(mark, "right-3 top-3 border-r border-t")} />
      <span className={cn(mark, "bottom-3 left-3 border-b border-l")} />
      <span className={cn(mark, "bottom-3 right-3 border-b border-r")} />
    </>
  );
}

function Portrait() {
  const p = about.portrait;
  const [badgeA, badgeB] = p.badges;
  return (
    <figure data-reveal className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-border bg-surface">
        {p.src ? (
          <img
            src={p.src}
            alt={p.alt}
            className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:grayscale-0"
          />
        ) : (
          <div role="img" aria-label={`${p.alt} (placeholder)`} className="absolute inset-0">
            <div className="grid-texture absolute inset-0 opacity-70" />
            <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_38%,color-mix(in_oklab,var(--powder)_18%,transparent),transparent_70%)]" />
            <div className="absolute inset-0 grid place-items-center">
              <span className="select-none font-serif text-[clamp(7rem,18vw,13rem)] italic leading-none text-powder/80 transition duration-700 group-hover:text-foreground">
                {profile.initials}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        )}
        <CropMarks />
        <span className="absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {profile.name}
        </span>
      </div>

      {/* Poppy badge accents */}
      {badgeA && (
        <span className="absolute -right-3 top-10 grid h-24 w-24 -rotate-12 place-items-center rounded-full bg-poppy text-center font-mono text-[10px] font-semibold uppercase leading-tight tracking-[0.14em] text-poppy-foreground shadow-[var(--glow-poppy)] transition-transform duration-500 group-hover:rotate-6 reduced:group-hover:-rotate-12 md:-right-6">
          <span className="px-3">
            <Sparkles className="mx-auto mb-1 h-3.5 w-3.5" />
            {badgeA}
          </span>
        </span>
      )}
      {badgeB && (
        <span className="absolute -left-2 bottom-16 rotate-[-4deg] rounded-sm bg-poppy-bright px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-poppy-foreground md:-left-5">
          {badgeB}
        </span>
      )}

    </figure>
  );
}

export function About() {
  const h = about.headline;
  return (
    <section id="about" className="relative scroll-mt-20 px-5 pb-12 pt-28 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          code={sectionCode("about")}
          kicker={about.kicker}
          title={
            <>
              {h.lead} <span className="font-serif font-normal italic text-poppy-bright">{h.accent}</span> {h.tail}
            </>
          }
        />

        <div className="mt-14 grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <Portrait />
          </div>

          <div className="md:col-span-7 md:pl-4">
            <p data-reveal className="text-balance-tight text-3xl font-medium leading-snug text-foreground md:text-4xl">
              {about.intro}
            </p>
            <p data-reveal className="mt-3 text-balance-tight text-xl leading-snug text-powder md:text-2xl">
              {about.introDetail}
            </p>
            <div data-reveal className="mt-8 grid gap-5 text-base leading-relaxed text-muted-foreground md:grid-cols-2">
              {about.narrative.map((para, i) => (
                <p key={i} className={cn(i === 0 && "first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-6xl first-letter:italic first-letter:leading-[0.8] first-letter:text-poppy-bright", i === 2 && "md:col-span-2")}>
                  {para}
                </p>
              ))}
            </div>

            <blockquote data-reveal className="relative mt-12 border-l-2 border-poppy pl-6">
              {about.statementLabel && <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-poppy-bright">{about.statementLabel}</p>}
              <p className="mt-3 font-serif text-3xl italic leading-tight text-foreground md:text-[2.6rem]">{about.statement}</p>
            </blockquote>

          </div>
        </div>
      </div>
    </section>
  );
}


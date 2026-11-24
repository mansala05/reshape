import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Maximize2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { posters, sectionCode, type Poster } from "@/data/portfolio";
import { playSound } from "@/lib/sound";
import { setUI, useUI } from "@/lib/ui-store";
import { cn } from "@/lib/utils";
import { PosterArt } from "./PosterArt";
import { SectionHeading } from "./SectionHeading";

const aspect = (p: Poster) => (p.ratio === "2:3" ? "2 / 3" : "3 / 4");

function openPoster(id: string) {
  playSound("open");
  setUI({ posterId: id });
}

function Sprockets() {
  return <div aria-hidden className="sprockets h-3 w-full opacity-70" />;
}

function Filmstrip() {
  const reduced = useUI((s) => s.reducedMotion);
  const options = useMemo(
    () => ({
      align: "start" as const,
      containScroll: "trimSnaps" as const,
      dragFree: !reduced,
      duration: reduced ? 12 : 30,
    }),
    [reduced],
  );
  const [viewportRef, api] = useEmblaCarousel(options);
  const bar = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  // Progress bar and counter are written directly so dragging never re-renders React.
  useEffect(() => {
    if (!api) return;
    const update = () => {
      const p = Math.max(0, Math.min(1, api.scrollProgress()));
      if (bar.current) bar.current.style.transform = `scaleX(${0.08 + p * 0.92})`;
      if (counter.current) {
        const n = Math.min(posters.length, Math.round(p * (posters.length - 1)) + 1);
        counter.current.textContent = String(n).padStart(2, "0");
      }
    };
    update();
    api.on("scroll", update).on("reInit", update).on("select", update);
    return () => {
      api.off("scroll", update).off("reInit", update).off("select", update);
    };
  }, [api]);

  const prev = useCallback(() => {
    api?.scrollPrev();
    playSound("tick");
  }, [api]);
  const next = useCallback(() => {
    api?.scrollNext();
    playSound("tick");
  }, [api]);

  return (
    <div data-reveal className="mt-14" data-no-ripple>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            <span ref={counter} className="text-foreground">
              01
            </span>{" "}
            / {String(posters.length).padStart(2, "0")}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous flyers"
              className="grid h-10 w-10 place-items-center rounded-full border border-border transition hover:border-poppy hover:bg-poppy hover:text-poppy-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next flyers"
              className="grid h-10 w-10 place-items-center rounded-full border border-border transition hover:border-poppy hover:bg-poppy hover:text-poppy-foreground"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 border-y border-border bg-surface/70 py-3">
        <Sprockets />
        <div
          ref={viewportRef}
          className="cursor-grab overflow-hidden py-6 active:cursor-grabbing"
          role="region"
          aria-roledescription="carousel"
          aria-label="Event posters and flyers"
        >
          <div className="flex touch-pan-y items-end">
            <div aria-hidden className="w-[max(1.25rem,calc((100vw-80rem)/2+2rem))] shrink-0" />
            {posters.map((p) => (
              <div
                key={p.id}
                className="shrink-0 pr-5 md:pr-7"
                aria-roledescription="slide"
                aria-label={`${p.index} of ${posters.length}`}
              >
                <button
                  type="button"
                  onClick={() => openPoster(p.id)}
                  className="group block text-left outline-none"
                  aria-label={`Open ${p.title}`}
                >
                  <div
                    className="relative h-[360px] overflow-hidden rounded-[3px] shadow-[var(--shadow-print)] ring-1 ring-border transition duration-500 group-hover:-translate-y-2 group-hover:ring-poppy group-focus-visible:ring-2 group-focus-visible:ring-poppy reduced:group-hover:translate-y-0 md:h-[460px]"
                    style={{ aspectRatio: aspect(p) }}
                  >
                    <PosterArt poster={p} className="pointer-events-none" />
                    <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-poppy text-poppy-foreground opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                      <Maximize2 className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.16em]">
                    <span className="text-muted-foreground">
                      <span className="text-poppy-bright">{p.index}</span> ▸ {p.kind}
                    </span>
                    <span className="text-powder/60">
                      {p.ratio} · {p.year}
                    </span>
                  </div>
                  <p className="mt-1 max-w-[260px] truncate text-sm font-medium text-foreground transition group-hover:text-poppy-bright">
                    {p.title}
                  </p>
                </button>
              </div>
            ))}
            <div aria-hidden className="w-[max(1.25rem,calc((100vw-80rem)/2+2rem))] shrink-0" />
          </div>
        </div>
        <Sprockets />
      </div>

      <div className="mx-auto mt-5 max-w-7xl px-5 md:px-8">
        <div className="h-px w-full overflow-hidden bg-border">
          <div
            ref={bar}
            className="h-full origin-left bg-poppy-bright transition-transform duration-150"
            style={{ transform: "scaleX(0.08)" }}
          />
        </div>
      </div>
    </div>
  );
}

function PosterLightbox() {
  const id = useUI((s) => s.posterId);
  const i = posters.findIndex((p) => p.id === id);
  const poster = i >= 0 ? posters[i] : undefined;

  const step = (dir: 1 | -1) => {
    const n = posters[(i + dir + posters.length) % posters.length];
    if (n) {
      playSound("tick");
      setUI({ posterId: n.id });
    }
  };

  return (
    <Dialog
      open={!!poster}
      onOpenChange={(o) => {
        if (!o) {
          playSound("close");
          setUI({ posterId: null });
        }
      }}
    >
      <DialogContent
        className="max-h-[92svh] max-w-5xl gap-0 overflow-y-auto border-border bg-popover p-0 sm:rounded-lg"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        {poster && (
          <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <div className="grid place-items-center bg-background p-6 md:p-10">
              <div
                key={poster.id}
                className="w-full max-w-[420px] overflow-hidden rounded-[3px] shadow-[var(--shadow-print)] ring-1 ring-border animate-in fade-in zoom-in-95 duration-300 reduced:zoom-in-100"
                style={{ aspectRatio: aspect(poster) }}
              >
                <PosterArt poster={poster} />
              </div>
            </div>

            <div className="flex flex-col border-t border-border p-7 md:border-l md:border-t-0">
              <div className="flex items-center gap-2">
                <span className="rounded-sm bg-poppy px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-poppy-foreground">
                  {poster.kind}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  N° {poster.index} · {poster.year}
                </span>
              </div>
              <DialogTitle className="mt-4 pr-6 text-3xl font-semibold leading-tight tracking-tight">
                {poster.title}
              </DialogTitle>
              <DialogDescription className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {poster.description}
              </DialogDescription>

              <dl className="mt-6 border-t border-border pt-5">
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-powder/60">
                  Event timeline
                </dt>
                <dd className="mt-1 font-serif text-lg italic text-powder">
                  {poster.date} · {poster.year}
                </dd>
              </dl>

              <div className="mt-auto flex items-center justify-between gap-3 pt-8">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] transition hover:border-poppy hover:text-poppy-bright"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Prev
                </button>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {String(i + 1).padStart(2, "0")} / {String(posters.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="inline-flex items-center gap-2 rounded-sm bg-powder px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-foreground"
                >
                  Next <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function Posters() {
  return (
    <section id="posters" className="relative scroll-mt-20 pb-8 pt-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          code={sectionCode("posters")}
          kicker="Volunteering"
          title={
            <>
              Ideas that take shape{" "}
              <span className="font-serif font-normal italic text-poppy-bright">beyond tech</span>.
            </>
          }
        >
          A look at the teams, communities, and initiatives I’ve contributed to.
        </SectionHeading>
      </div>
      <Filmstrip />
      <PosterLightbox />
    </section>
  );
}

import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { projects, sectionCode, type Project } from "@/data/portfolio";
import { playSound } from "@/lib/sound";
import { setUI, useUI } from "@/lib/ui-store";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SectionHeading } from "./SectionHeading";
import { ProjectPreview } from "./previews";

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Pin-and-slide needs room: tablet/desktop with enough height, and full motion. */
const PIN_QUERY = "(min-width: 768px) and (min-height: 560px)";

function useLabMode(): "pin" | "swipe" {
  const reduced = useUI((s) => s.reducedMotion);
  const [roomy, setRoomy] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(PIN_QUERY);
    const sync = () => setRoomy(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);
  return roomy && !reduced ? "pin" : "swipe";
}

function FinalistBadge({ award }: { award: NonNullable<Project["award"]> }) {
  return (
    <span className="absolute left-4 top-4 z-10 flex max-w-[75%] flex-col items-start gap-1.5">
      <span className="inline-flex items-center gap-1.5 rounded-sm bg-poppy py-1 pl-2 pr-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-poppy-foreground shadow-[var(--glow-poppy)]">
        <Star className="h-3 w-3 fill-current" />
        {award.label}
      </span>
      <span className="rounded-sm border border-poppy/40 bg-background/80 px-2 py-1 font-mono text-[10px] uppercase leading-snug tracking-[0.14em] text-foreground backdrop-blur">
        {award.event}
      </span>
    </span>
  );
}

function Thumb({ project, live }: { project: Project; live: boolean }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden">
      <div className="absolute inset-0 border-b border-border bg-background" />
      {project.screenshots?.[0] ? (
        <img
          src={project.screenshots[0].src}
          alt={project.screenshots[0].alt}
          className={cn(
            "absolute inset-0 h-full w-full",
            project.coverFit === "contain" ? "object-contain" : "object-cover object-top",
          )}
          loading="lazy"
        />
      ) : live && project.preview ? (
        <div className="pointer-events-none absolute inset-0 animate-in fade-in duration-500">
          <ProjectPreview kind={project.preview} interactive={false} />
        </div>
      ) : (
        <div className="grid-texture absolute inset-0 opacity-80">
          <div className="absolute inset-0 grid place-items-center">
            <span className="font-mono text-[7rem] font-semibold leading-none text-powder/10">
              {project.index}
            </span>
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
      {project.award && <FinalistBadge award={project.award} />}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [live, setLive] = useState(false);
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const ref = useRef<HTMLElement>(null);

  // Previews run only while the card is actually on screen (clipped cards in the reel count as hidden).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(!!e?.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      data-card
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setSpot({
          x: ((e.clientX - r.left) / r.width) * 100,
          y: ((e.clientY - r.top) / r.height) * 100,
        });
      }}
      className={cn(
        "lab-card group relative flex shrink-0 snap-start flex-col overflow-hidden rounded-lg border bg-card transition-all duration-500",
        "hover:-translate-y-1 hover:glow-powder reduced:hover:translate-y-0",
        project.award
          ? "border-poppy/40 hover:border-poppy/70"
          : "border-border hover:border-powder/40",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${spot.x}% ${spot.y}%, color-mix(in oklab, var(--powder) 10%, transparent), transparent 60%)`,
        }}
      />
      <button
        type="button"
        onClick={() => {
          playSound("open");
          setUI({ projectId: project.id });
        }}
        className="flex h-full w-full flex-col text-left"
        aria-label={`Open preview of ${project.title}${project.award ? ` — ${project.award.label}, ${project.award.event}` : ""}`}
      >
        <Thumb project={project} live={live} />
        <div className="relative z-20 flex flex-1 flex-col p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="text-poppy-bright">{project.index}</span> · {project.year} ·{" "}
                {project.role}
              </p>
              <h3 className="mt-2 text-xl font-semibold leading-tight tracking-tight lg:text-2xl">
                {project.title}
              </h3>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border transition group-hover:border-poppy group-hover:bg-poppy group-hover:text-poppy-foreground">
              <Maximize2 className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{project.summary}</p>
          <ul className="mt-auto flex flex-wrap gap-2 pt-5">
            {project.tags.map((t) => (
              <li
                key={t}
                className="rounded-sm border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-powder"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </button>
    </article>
  );
}

/**
 * The Lab reel. On tablet/desktop with full motion it pins in view and vertical scroll slides it
 * sideways; on phones and in reduced-motion mode it is a native swipe row with snap points.
 * Transforms and the progress readout are written through refs so scrolling never re-renders React.
 */
function Reel() {
  const mode = useLabMode();
  const reduced = useUI((s) => s.reducedMotion);
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [distance, setDistance] = useState(0);
  const [stageHeight, setStageHeight] = useState(0);
  const distanceRef = useRef(0);

  const step = useCallback(() => {
    const cards = track.current?.querySelectorAll<HTMLElement>("[data-card]");
    if (!cards || cards.length < 2) return 1;
    return cards[1]!.offsetLeft - cards[0]!.offsetLeft;
  }, []);

  const paint = useCallback(
    (x: number, max: number) => {
      const p = max > 0 ? Math.min(1, Math.max(0, x / max)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${Math.max(p, 0.02)})`;
      if (counter.current) {
        const first = Math.min(projects.length, Math.round(x / step()) + 1);
        counter.current.textContent = pad2(first);
      }
    },
    [step],
  );

  // Measure how far the track has to travel.
  useEffect(() => {
    const t = track.current;
    const st = stage.current;
    if (!t || !st) return;
    if (mode !== "pin") {
      t.style.transform = "";
      distanceRef.current = 0;
      setDistance(0);
      return;
    }
    const measure = () => {
      const d = Math.max(0, t.offsetWidth - st.clientWidth);
      distanceRef.current = d;
      setDistance(d);
      setStageHeight(st.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    ro.observe(st);
    return () => ro.disconnect();
  }, [mode]);

  // Pin mode: map the wrapper's scroll position to a horizontal offset, eased a little.
  useEffect(() => {
    if (mode !== "pin") return;
    const w = wrap.current;
    const t = track.current;
    if (!w || !t) return;
    let raf = 0;
    let x = -1;
    let last = 0;
    let visible = false;
    const target = () => Math.min(distanceRef.current, Math.max(0, -w.getBoundingClientRect().top));
    const tick = (now: number) => {
      const tx = target();
      // Frame-rate independent easing; slow frames simply catch up.
      const dt = last ? Math.min(0.25, (now - last) / 1000) : 1;
      last = now;
      x = x < 0 ? tx : x + (tx - x) * (1 - Math.exp(-dt * 11));
      if (Math.abs(tx - x) < 0.25) x = tx;
      t.style.transform = `translate3d(${-x}px,0,0)`;
      paint(x, distanceRef.current);
      raf = visible ? requestAnimationFrame(tick) : 0;
      if (!raf) last = 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      if (visible && !raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(w);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [mode, paint]);

  // Swipe mode: progress follows the native horizontal scroll.
  useEffect(() => {
    if (mode !== "swipe") return;
    const st = stage.current;
    if (!st) return;
    const onScroll = () => paint(st.scrollLeft, st.scrollWidth - st.clientWidth);
    onScroll();
    st.addEventListener("scroll", onScroll, { passive: true });
    return () => st.removeEventListener("scroll", onScroll);
  }, [mode, paint]);

  const pageTop = () =>
    wrap.current ? wrap.current.getBoundingClientRect().top + window.scrollY : 0;

  const go = (dir: 1 | -1) => {
    playSound("tick");
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
    if (mode === "pin") {
      const current = Math.min(distanceRef.current, Math.max(0, window.scrollY - pageTop()));
      const s = step();
      const next = Math.min(distanceRef.current, Math.max(0, Math.round(current / s + dir) * s));
      window.scrollTo({ top: pageTop() + next, behavior });
    } else {
      stage.current?.scrollBy({ left: dir * step(), behavior });
    }
  };

  // Keyboard focus on a card that is off to the side scrolls the page so it slides into view.
  const onFocus = (e: React.FocusEvent) => {
    if (mode !== "pin") return;
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-card]");
    const st = stage.current;
    const t = track.current;
    if (!card || !st || !t) return;
    const padLeft = parseFloat(getComputedStyle(t).paddingLeft) || 0;
    const current = Math.min(distanceRef.current, Math.max(0, window.scrollY - pageTop()));
    const left = card.offsetLeft - current;
    if (left >= padLeft - 1 && left + card.offsetWidth <= st.clientWidth - padLeft + 1) return;
    const next = Math.min(distanceRef.current, Math.max(0, card.offsetLeft - padLeft));
    window.scrollTo({ top: pageTop() + next, behavior: "auto" });
  };

  const pinned = mode === "pin";

  return (
    <div
      ref={wrap}
      className="relative mt-12"
      style={pinned && stageHeight ? { height: stageHeight + distance } : undefined}
    >
      <div
        ref={stage}
        className={cn(
          "lab-stage",
          pinned
            ? "sticky top-0 flex min-h-[max(42rem,80svh)] flex-col justify-start overflow-clip pb-6 pt-24"
            : "lab-scroller snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-2",
        )}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 md:px-8",
            pinned ? "mb-6" : "sticky left-0 mb-6",
          )}
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              <span ref={counter} className="text-foreground">
                01
              </span>{" "}
              / {pad2(projects.length)}
            </span>
            <span className="relative block h-px w-28 overflow-hidden bg-border md:w-48">
              <span
                ref={bar}
                className="absolute inset-0 origin-left bg-poppy-bright"
                style={{ transform: "scaleX(0.02)" }}
              />
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous projects"
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground transition hover:border-poppy hover:text-poppy-bright"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next projects"
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground transition hover:border-poppy hover:text-poppy-bright"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={track}
          onFocus={onFocus}
          role="list"
          aria-label="Projects"
          className="lab-track flex w-max items-stretch will-change-transform"
        >
          {projects.map((p) => (
            <div role="listitem" key={p.id} className="flex">
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectScreenshots({ screenshots }: { screenshots: NonNullable<Project["screenshots"]> }) {
  const [selected, setSelected] = useState(0);
  const screenshot = screenshots[selected];
  if (!screenshot) return null;

  return (
    <div className="flex h-full flex-col">
      <figure className="flex min-h-0 flex-1 flex-col">
        <div
          key={screenshot.src}
          className="h-80 overflow-auto md:h-[460px]"
          tabIndex={screenshot.scrollable ? 0 : undefined}
          role={screenshot.scrollable ? "region" : undefined}
          aria-label={screenshot.scrollable ? "Scrollable screenshot" : undefined}
        >
          <img
            src={screenshot.src}
            alt={screenshot.alt}
            className={
              screenshot.scrollable
                ? "h-auto w-full min-w-[640px] max-w-none"
                : "h-full w-full object-contain"
            }
          />
        </div>
        <figcaption className="px-5 py-3 text-sm text-muted-foreground">
          {screenshot.alt}
          {screenshot.scrollable && (
            <a
              className="mt-2 block text-powder underline"
              href={screenshot.src}
              target="_blank"
              rel="noreferrer"
            >
              Open full-size image
            </a>
          )}
        </figcaption>
      </figure>
      <div className="flex gap-2 overflow-x-auto p-4" aria-label="Project screenshots">
        {screenshots.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setSelected(index)}
            aria-label={`View screenshot ${index + 1}: ${image.alt}`}
            aria-pressed={selected === index}
            className={cn(
              "shrink-0 overflow-hidden rounded-sm border",
              selected === index ? "border-powder" : "border-border",
            )}
          >
            <img
              src={image.src}
              alt=""
              loading="lazy"
              className="h-12 w-20 object-cover object-top"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function ProjectModal() {
  const id = useUI((s) => s.projectId);
  const project = projects.find((p) => p.id === id);

  return (
    <Dialog
      open={!!project}
      onOpenChange={(o) => {
        if (!o) {
          playSound("close");
          setUI({ projectId: null });
        }
      }}
    >
      <DialogContent className="max-h-[90svh] max-w-6xl gap-0 overflow-y-auto border-border bg-popover p-0 sm:rounded-lg">
        {project && (
          <div className="grid md:grid-cols-[1.6fr_1fr]">
            <div
              className={cn(
                "relative bg-background md:min-h-[540px]",
                !project.screenshots?.length && "aspect-[4/3] md:aspect-auto",
              )}
            >
              {project.screenshots?.length ? (
                <ProjectScreenshots key={project.id} screenshots={project.screenshots} />
              ) : project.preview ? (
                <>
                  <ProjectPreview kind={project.preview} />
                  <span className="absolute right-4 top-4 rounded-sm bg-poppy px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-poppy-foreground">
                    Interactive
                  </span>
                </>
              ) : (
                <div className="grid-texture absolute inset-0 grid place-items-center">
                  <span className="font-mono text-[7rem] font-semibold leading-none text-powder/10">
                    {project.index}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col border-t border-border p-7 md:border-l md:border-t-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="text-poppy-bright">{project.index}</span> · {project.year}
              </p>
              <DialogTitle className="mt-3 text-3xl font-semibold leading-tight tracking-tight">
                {project.title}
              </DialogTitle>
              <p className="mt-1 font-serif text-lg italic text-powder">{project.role}</p>
              {project.award && (
                <p className="mt-5 inline-flex w-fit items-center gap-2 rounded-sm border border-poppy/50 bg-poppy/10 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground shadow-[var(--glow-poppy)]">
                  <Star className="h-3.5 w-3.5 fill-current text-poppy-bright" />
                  <span className="text-poppy-bright">{project.award.label}</span>
                  <span className="text-muted-foreground">·</span>
                  {project.award.event}
                </p>
              )}
              <DialogDescription className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </DialogDescription>
              <ul className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-sm border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-powder"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap gap-3 pt-8">
                {project.links.map((l, i) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "inline-flex items-center gap-2 rounded-sm px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] transition",
                      i === 0
                        ? "bg-powder text-primary-foreground hover:bg-foreground"
                        : "border border-border text-foreground hover:border-poppy hover:text-poppy-bright",
                    )}
                  >
                    {l.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function Projects() {
  return (
    <section id="work" className="relative scroll-mt-20 pb-10 pt-28 md:pb-12">
      <div className="px-5 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            code={sectionCode("work")}
            kicker="Experiences"
            wideDescription
            title={
              <>
                Experiments that{" "}
                <span className="font-serif font-normal italic text-powder">run</span>, not just
                render.
              </>
            }
          >
            <span className="xl:whitespace-nowrap">
              <span className="text-powder">
                Projects I've built for hackathons, university, and ideas of my own,
              </span>{" "}
              <span className="text-foreground">
                with finalist entries clearly marked on their cards.
              </span>
            </span>
          </SectionHeading>
        </div>
      </div>
      <Reel />
      <ProjectModal />
    </section>
  );
}

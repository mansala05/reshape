import type { Poster } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/**
 * Placeholder flyer artwork drawn from poster data. Sizes use container units, so
 * the same flyer looks identical in the filmstrip and the lightbox. When the owner
 * adds `image`, the real flyer replaces it.
 */
export function PosterArt({ poster, className }: { poster: Poster; className?: string }) {
  if (poster.image) {
    return (
      <img
        src={poster.image}
        alt={`${poster.title} poster`}
        draggable={false}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  // Artwork colors are the flyer's own content (edited in portfolio.ts), not site theme colors.
  const { bg, ink, accent, face, layout } = poster.art;
  const faceClass = face === "serif" ? "font-serif italic font-normal" : face === "mono" ? "font-mono font-semibold" : "font-sans font-semibold";
  const lines = poster.headline.split("\n");

  return (
    <div
      role="img"
      aria-label={`${poster.title} flyer (placeholder artwork)`}
      className={cn("@container relative h-full w-full select-none overflow-hidden", className)}
      style={{ background: bg, color: ink }}
    >
      {layout === "stack" && (
        <div className="absolute inset-0 flex flex-col p-[6cqw]">
          <div className="flex justify-between font-mono text-[3.2cqw] uppercase tracking-[0.12em]">
            <span>{poster.kind}</span>
            <span>{poster.date}</span>
          </div>
          <div className={cn("mt-[6cqw] leading-[0.82] tracking-[-0.05em]", faceClass)} style={{ fontSize: "24cqw" }}>
            {lines.map((l, i) => (
              <span key={i} className="block" style={i % 2 ? { color: accent } : undefined}>
                {l}
              </span>
            ))}
          </div>
          <div className="mt-auto">
            <div className="h-[1.2cqw]" style={{ background: accent }} />
            <ul className="mt-[3cqw] space-y-[0.6cqw] font-mono text-[3.4cqw] uppercase tracking-[0.06em]">
              {poster.lineup.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <p className="mt-[4cqw] flex justify-between font-mono text-[2.8cqw] uppercase tracking-[0.14em] opacity-80">
              <span>{poster.venue}</span>
              <span>{poster.city}</span>
            </p>
          </div>
        </div>
      )}

      {layout === "orbit" && (
        <div className="absolute inset-0 flex flex-col items-center p-[6cqw] text-center">
          <p className="font-mono text-[3cqw] uppercase tracking-[0.3em]">{poster.kind} · {poster.year}</p>
          <div className="relative mt-[8cqw] grid aspect-square w-[78cqw] place-items-center rounded-full" style={{ background: accent }}>
            <div className={cn("leading-[0.85]", faceClass)} style={{ fontSize: "19cqw", color: bg }}>
              {lines.map((l, i) => (
                <span key={i} className="block">
                  {l}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-[6cqw] font-serif text-[6cqw] italic">{poster.date}</p>
          <p className="mt-auto font-mono text-[2.8cqw] uppercase tracking-[0.18em] opacity-85">
            {poster.lineup.join(" · ")}
          </p>
          <p className="mt-[2cqw] font-mono text-[2.8cqw] uppercase tracking-[0.18em]">
            {poster.venue} — {poster.city}
          </p>
        </div>
      )}

      {layout === "grid" && (
        <div className="absolute inset-0 p-[6cqw]">
          <div
            className="absolute inset-[6cqw] opacity-25"
            style={{
              backgroundImage: `linear-gradient(90deg, ${ink} 1px, transparent 1px)`,
              backgroundSize: "calc(100% / 6) 100%",
            }}
          />
          <div className="relative flex h-full flex-col">
            <div className={cn("leading-[0.9] tracking-[-0.03em]", faceClass)} style={{ fontSize: "13cqw" }}>
              {lines.map((l, i) => (
                <span key={i} className="block">
                  {l}
                </span>
              ))}
            </div>
            <span className="mt-[2cqw] font-mono text-[3cqw] uppercase tracking-[0.14em]">{poster.kind}</span>
            <span className="mt-auto font-mono font-semibold leading-[0.8] tracking-[-0.06em]" style={{ fontSize: "54cqw", color: accent }}>
              {poster.index}
            </span>
            <div className="mt-[3cqw] grid grid-cols-2 gap-[3cqw] border-t pt-[3cqw] font-mono text-[2.8cqw] uppercase tracking-[0.1em]" style={{ borderColor: ink }}>
              <span>{poster.date}</span>
              <span className="text-right">{poster.city}</span>
              <span className="col-span-2 opacity-80">{poster.lineup.join(" / ")}</span>
            </div>
          </div>
        </div>
      )}

      {layout === "split" && (
        <div className="absolute inset-0 flex flex-col">
          <div className="relative flex-[1.1] p-[6cqw]" style={{ background: accent, color: bg }}>
            <p className="flex justify-between font-mono text-[3cqw] uppercase tracking-[0.2em]">
              <span>{poster.kind} — {poster.year}</span>
              <span>N° {poster.index}</span>
            </p>
            <div className={cn("absolute bottom-[4cqw] left-[6cqw] right-[6cqw] leading-[0.85]", faceClass)} style={{ fontSize: "20cqw" }}>
              {lines.map((l, i) => (
                <span key={i} className="block">
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-1 flex-col p-[6cqw]">
            <p className="font-serif text-[8cqw] italic leading-tight">{poster.date}</p>
            <ul className="mt-[4cqw] space-y-[0.8cqw] font-mono text-[3.2cqw] uppercase tracking-[0.08em]">
              {poster.lineup.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <p className="mt-auto font-mono text-[2.8cqw] uppercase tracking-[0.16em] opacity-85">
              {poster.venue} · {poster.city}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

import { Activity, Gauge, Waves, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { heroInput } from "@/lib/hero-input";
import { initMotion, setReducedMotion } from "@/lib/motion";
import { playSound } from "@/lib/sound";
import { setUI, useUI } from "@/lib/ui-store";
import { cn } from "@/lib/utils";

/** Plays soft ticks on hover and clicks on any interactive element when sound is on. */
function useGlobalSoundEffects() {
  useEffect(() => {
    let last: Element | null = null;
    let lastT = 0;
    const SEL = "a, button, [role='option'], tr[tabindex]";
    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest(SEL) ?? null;
      if (!el || el === last) return;
      last = el;
      const now = performance.now();
      if (now - lastT < 45) return;
      lastT = now;
      playSound("tick");
    };
    const onOut = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest(SEL);
      if (el === last && !(e.relatedTarget as Element | null)?.closest?.(SEL)) last = null;
    };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);
}

type Sample = { fps: number; ms: number; calls: number; triangles: number; dpr: number; heap: number | null };

function StatsPanel({ onClose }: { onClose: () => void }) {
  const [s, setS] = useState<Sample>({ fps: 0, ms: 0, calls: 0, triangles: 0, dpr: 1, heap: null });
  const history = useRef<number[]>([]);

  useEffect(() => {
    // Measure page FPS independently, so the widget works even before the 3D layer loads.
    let frames = 0;
    let t0 = performance.now();
    let raf = 0;
    let fps = 0;
    const loop = (now: number) => {
      frames++;
      if (now - t0 >= 500) {
        fps = Math.round((frames * 1000) / (now - t0));
        frames = 0;
        t0 = now;
        const mem = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
        history.current = [...history.current.slice(-39), fps];
        setS({
          fps,
          ms: fps ? +(1000 / fps).toFixed(1) : 0,
          calls: heroInput.stats.calls,
          triangles: heroInput.stats.triangles,
          dpr: heroInput.stats.dpr || window.devicePixelRatio,
          heap: mem ? Math.round(mem.usedJSHeapSize / 1048576) : null,
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const h = history.current;
  const max = Math.max(60, ...h);
  const points = h.map((v, i) => `${(i / 39) * 160},${36 - (v / max) * 32}`).join(" ");
  const tone = s.fps >= 50 ? "text-powder" : s.fps >= 30 ? "text-foreground" : "text-poppy-bright";

  return (
    <div className="w-[220px] rounded-lg border border-border p-3 font-mono text-[11px] shadow-2xl glass animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between">
        <span className="uppercase tracking-[0.18em] text-muted-foreground">Perf monitor</span>
        <button type="button" onClick={onClose} aria-label="Close stats" className="text-muted-foreground hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className={cn("text-3xl font-semibold tabular-nums", tone)}>{s.fps}</span>
        <span className="text-muted-foreground">fps · {s.ms}ms</span>
      </div>
      <svg viewBox="0 0 160 38" className="mt-1 h-9 w-full" aria-hidden>
        <line x1="0" x2="160" y1={36 - (60 / max) * 32} y2={36 - (60 / max) * 32} stroke="var(--border)" strokeDasharray="2 3" />
        <polyline points={points} fill="none" stroke="var(--poppy-bright)" strokeWidth="1.5" />
      </svg>
      <dl className="mt-2 grid grid-cols-2 gap-y-1 text-muted-foreground">
        <dt>draw calls</dt>
        <dd className="text-right tabular-nums text-foreground">{s.calls}</dd>
        <dt>triangles</dt>
        <dd className="text-right tabular-nums text-foreground">{s.triangles.toLocaleString()}</dd>
        <dt>pixel ratio</dt>
        <dd className="text-right tabular-nums text-foreground">{s.dpr.toFixed(2)}</dd>
        {s.heap !== null && (
          <>
            <dt>js heap</dt>
            <dd className="text-right tabular-nums text-foreground">{s.heap} MB</dd>
          </>
        )}
      </dl>
    </div>
  );
}

export function UtilityDock() {
  const statsOpen = useUI((s) => s.statsOpen);
  const reduced = useUI((s) => s.reducedMotion);
  const motionSource = useUI((s) => s.motionSource);
  useGlobalSoundEffects();
  useEffect(() => initMotion(), []);

  const btn =
    "grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-powder/60 hover:text-foreground";

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3" data-no-ripple>
      {statsOpen && <StatsPanel onClose={() => setUI({ statsOpen: false })} />}
      <div className="flex items-center gap-1.5 rounded-full border border-border p-1.5 shadow-xl glass">
        <button
          type="button"
          aria-label="Toggle performance stats"
          aria-pressed={statsOpen}
          onClick={() => setUI({ statsOpen: !statsOpen })}
          className={cn(btn, statsOpen && "border-powder text-powder")}
        >
          <Activity className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Reduce motion"
          aria-pressed={reduced}
          title={
            reduced
              ? `Reduced motion is on${motionSource === "system" ? " (from your device settings)" : ""}. Click for full motion.`
              : "Reduce motion: calmer 3D, no cursor physics"
          }
          onClick={() => {
            setReducedMotion(!reduced);
            playSound("toggle");
          }}
          className={cn(btn, reduced && "border-powder bg-powder text-primary-foreground hover:text-primary-foreground")}
        >
          {reduced ? <Gauge className="h-4 w-4" /> : <Waves className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

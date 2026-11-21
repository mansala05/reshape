import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useRef } from "react";

import { attachHeroInput } from "@/lib/hero-input";
import { playSound } from "@/lib/sound";

const HeroScene = lazy(() => import("./HeroScene"));

/** Fixed full-screen 3D layer behind the page. Fades as the visitor scrolls. */
export function HeroCanvas() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const detach = attachHeroInput(() => playSound("ripple"));
    const onScroll = () => {
      const s = window.scrollY / Math.max(1, window.innerHeight);
      if (wrap.current) wrap.current.style.opacity = String(Math.max(0.28, 1 - s * 0.75));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      detach();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      ref={wrap}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
    >
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_45%,var(--surface-2),transparent_70%)]" />
      <ClientOnly fallback={null}>
        <Suspense fallback={null}>
          <HeroScene
            onReady={() => {
              wrap.current?.setAttribute("data-scene-ready", "true");
            }}
          />
        </Suspense>
      </ClientOnly>
      <div className="grid-texture absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
    </div>
  );
}

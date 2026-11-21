/**
 * Shared, non-React input state for the 3D hero. Written by window listeners,
 * read every frame inside the scene. Keeps per-frame data out of React state.
 */

export type Ripple = { x: number; y: number; t: number; consumed: boolean };

export const heroInput = {
  px: 0,
  py: 0,
  vx: 0,
  vy: 0,
  speed: 0,
  scroll: 0,
  /** Reduced-motion target, set by src/lib/motion.ts. */
  reduced: false,
  /** 0 = full motion, 1 = reduced. Eased toward `reduced` each frame so switching is smooth. */
  calm: 0,
  ripples: [] as Ripple[],
  stats: { fps: 0, ms: 0, calls: 0, triangles: 0, dpr: 1 },
};

const NO_RIPPLE =
  "a, button, input, textarea, select, label, [role='dialog'], [data-no-ripple], [cmdk-root]";

export function attachHeroInput(onRipple?: () => void): () => void {
  let lastT = performance.now();

  const onMove = (e: PointerEvent) => {
    const now = performance.now();
    const dt = Math.max(1, now - lastT) / 1000;
    lastT = now;
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = -((e.clientY / window.innerHeight) * 2 - 1);
    const vx = (nx - heroInput.px) / dt;
    const vy = (ny - heroInput.py) / dt;
    // Smooth the velocity so single noisy events do not spike the scene.
    heroInput.vx = heroInput.vx * 0.7 + vx * 0.3;
    heroInput.vy = heroInput.vy * 0.7 + vy * 0.3;
    heroInput.px = nx;
    heroInput.py = ny;
  };

  const onScroll = () => {
    heroInput.scroll = window.scrollY / Math.max(1, window.innerHeight);
  };

  const onDown = (e: PointerEvent) => {
    const target = e.target as Element | null;
    if (target?.closest(NO_RIPPLE)) return;
    if (heroInput.scroll > 1.4) return;
    heroInput.ripples.push({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -((e.clientY / window.innerHeight) * 2 - 1),
      t: performance.now(),
      consumed: false,
    });
    if (heroInput.ripples.length > 8) heroInput.ripples.shift();
    onRipple?.();
  };

  onScroll();
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("scroll", onScroll);
  };
}

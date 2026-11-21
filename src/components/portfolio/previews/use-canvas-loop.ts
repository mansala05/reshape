import { useEffect, useRef } from "react";

export type Pointer = { x: number; y: number; inside: boolean; down: boolean; vx: number; vy: number };

/**
 * Sizes a canvas to its parent at device pixel ratio and runs a frame loop.
 * `frame` receives CSS-pixel width/height and a pointer in CSS pixels.
 */
export function useCanvasLoop(
  frame: (ctx: { w: number; h: number; dpr: number; t: number; dt: number; pointer: Pointer }) => void,
  opts: { setup?: (canvas: HTMLCanvasElement) => (() => void) | void; maxDpr?: number } = {},
) {
  const ref = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(frame);
  frameRef.current = frame;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const pointer: Pointer = { x: -9999, y: -9999, inside: false, down: false, vx: 0, vy: 0 };
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, opts.maxDpr ?? 2);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const nx = e.clientX - r.left;
      const ny = e.clientY - r.top;
      pointer.vx = nx - pointer.x;
      pointer.vy = ny - pointer.y;
      pointer.x = nx;
      pointer.y = ny;
    };
    const onMove = (e: PointerEvent) => {
      local(e);
      pointer.inside = true;
    };
    const onLeave = () => {
      pointer.inside = false;
      pointer.down = false;
    };
    const onDown = (e: PointerEvent) => {
      local(e);
      pointer.down = true;
      canvas.setPointerCapture?.(e.pointerId);
    };
    const onUp = () => {
      pointer.down = false;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    const cleanupSetup = opts.setup?.(canvas);

    let raf = 0;
    let last = performance.now();
    const start = last;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      frameRef.current({ w, h, dpr, t: (now - start) / 1000, dt, pointer });
      pointer.vx *= 0.8;
      pointer.vy *= 0.8;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cleanupSetup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

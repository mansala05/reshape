import { useRef } from "react";

import { isReducedMotion } from "@/lib/motion";
import { rgb } from "@/lib/palette";
import { useCanvasLoop } from "./use-canvas-loop";

const SPRING = 0.06;
const DAMP = 0.86;
const RADIUS = 70;
const PUSH = 9;

type P = { x: number; y: number; hx: number; hy: number; vx: number; vy: number };

export function KineticPreview({ word = "PLAY" }: { word?: string }) {
  const particles = useRef<P[]>([]);
  const size = useRef({ w: 0, h: 0 });

  const build = (w: number, h: number) => {
    const off = document.createElement("canvas");
    off.width = Math.round(w);
    off.height = Math.round(h);
    const o = off.getContext("2d");
    if (!o) return;
    const fs = Math.min(h * 0.55, (w / word.length) * 1.45);
    o.fillStyle = "#000";
    o.font = `800 ${fs}px "Geist", system-ui, sans-serif`;
    o.textAlign = "center";
    o.textBaseline = "middle";
    o.fillText(word, w / 2, h / 2);
    const data = o.getImageData(0, 0, off.width, off.height).data;
    const step = Math.max(4, Math.round(Math.min(w, h) / 90));
    const out: P[] = [];
    const calm = isReducedMotion();
    for (let y = 0; y < off.height; y += step) {
      for (let x = 0; x < off.width; x += step) {
        if ((data[(y * off.width + x) * 4 + 3] ?? 0) > 128) {
          // Reduced motion skips the scatter-in intro: letters start assembled.
          out.push({
            x: calm ? x : Math.random() * w,
            y: calm ? y : Math.random() * h,
            hx: x,
            hy: y,
            vx: 0,
            vy: 0,
          });
        }
      }
    }
    particles.current = out;
  };

  const ref = useCanvasLoop(({ w, h, dpr, pointer }) => {
    const c = ref.current?.getContext("2d");
    if (!c) return;
    if (Math.abs(size.current.w - w) > 1 || Math.abs(size.current.h - h) > 1) {
      size.current = { w, h };
      build(w, h);
    }
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = `rgba(${rgb.raven.join(",")},0.4)`;
    c.fillRect(0, 0, w, h);

    const calm = isReducedMotion();
    const radius = calm ? RADIUS * 0.6 : RADIUS;
    const push = calm ? PUSH * 0.25 : PUSH;
    const drag = calm ? 0 : 0.05;
    for (const p of particles.current) {
      if (pointer.inside) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < radius * radius) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / radius) * push;
          p.vx += (dx / d) * f + pointer.vx * drag;
          p.vy += (dy / d) * f + pointer.vy * drag;
        }
      }
      p.vx += (p.hx - p.x) * SPRING;
      p.vy += (p.hy - p.y) * SPRING;
      p.vx *= DAMP;
      p.vy *= DAMP;
      p.x += p.vx;
      p.y += p.vy;
      const off = Math.min(1, Math.hypot(p.x - p.hx, p.y - p.hy) / 40);
      c.fillStyle =
        off > 0.25
          ? `rgba(${rgb.poppy.join(",")},${0.5 + off * 0.5})`
          : `rgba(${rgb.powder.join(",")},0.9)`;
      c.fillRect(p.x - 1.2, p.y - 1.2, 2.4, 2.4);
    }
  });

  return <canvas ref={ref} className="h-full w-full cursor-crosshair touch-none" />;
}

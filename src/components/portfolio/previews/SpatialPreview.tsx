import { useMemo, useRef } from "react";

import { isReducedMotion } from "@/lib/motion";
import { rgb } from "@/lib/palette";
import { useCanvasLoop } from "./use-canvas-loop";

const POINTS = 900;
const FRICTION = 2.2;

export function SpatialPreview() {
  const pts = useMemo(() => {
    const arr: { x: number; y: number; z: number; hot: boolean }[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < POINTS; i++) {
      const y = 1 - (i / (POINTS - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      arr.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r, hot: i % 37 === 0 });
    }
    // Orbit ring
    for (let i = 0; i < 160; i++) {
      const a = (i / 160) * Math.PI * 2;
      arr.push({ x: Math.cos(a) * 1.45, y: Math.sin(a) * 0.12, z: Math.sin(a) * 1.45, hot: false });
    }
    return arr;
  }, []);

  const rot = useRef({ x: -0.3, y: 0, vx: 0, vy: 0.35 });

  const ref = useCanvasLoop(({ w, h, dpr, dt, pointer }) => {
    const c = ref.current?.getContext("2d");
    if (!c) return;
    const r = rot.current;
    const calm = isReducedMotion();
    // Reduced motion: slow idle spin, drag still works but throws are damped quickly.
    const idle = calm ? 0.06 : 0.3;
    const grab = calm ? 0.35 : 0.6;
    const friction = calm ? FRICTION * 3 : FRICTION;
    if (pointer.down) {
      r.vy = pointer.vx * grab;
      r.vx = pointer.vy * grab;
    } else {
      r.vx *= Math.exp(-friction * dt);
      r.vy += (idle - r.vy) * (1 - Math.exp(-(calm ? 2 : 0.6) * dt));
    }
    r.y += r.vy * dt;
    r.x = Math.max(-1.2, Math.min(1.2, r.x + r.vx * dt));

    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = `rgb(${rgb.raven.join(",")})`;
    c.fillRect(0, 0, w, h);

    // Floor grid for spatial depth.
    c.strokeStyle = `rgba(${rgb.powder.join(",")},0.06)`;
    c.lineWidth = 1;
    for (let gx = 0; gx < w; gx += 32) {
      c.beginPath();
      c.moveTo(gx, 0);
      c.lineTo(gx, h);
      c.stroke();
    }
    for (let gy = 0; gy < h; gy += 32) {
      c.beginPath();
      c.moveTo(0, gy);
      c.lineTo(w, gy);
      c.stroke();
    }

    const cy = Math.cos(r.y);
    const sy = Math.sin(r.y);
    const cx = Math.cos(r.x);
    const sx = Math.sin(r.x);
    const R = Math.min(w, h) * 0.32;
    const fov = 2.6;

    const proj = pts.map((p) => {
      const x1 = p.x * cy - p.z * sy;
      const z1 = p.x * sy + p.z * cy;
      const y2 = p.y * cx - z1 * sx;
      const z2 = p.y * sx + z1 * cx;
      const k = fov / (fov + z2);
      return { X: w / 2 + x1 * R * k, Y: h / 2 + y2 * R * k, z: z2, k, hot: p.hot };
    });
    proj.sort((a, b) => b.z - a.z);

    for (const p of proj) {
      const depth = (1 - p.z) / 2; // 0 back, 1 front
      const size = 0.6 + p.k * 1.6 * (p.hot ? 2 : 1);
      c.fillStyle = p.hot
        ? `rgba(${rgb.poppy.join(",")},${0.4 + depth * 0.6})`
        : `rgba(${rgb.powder.join(",")},${0.12 + depth * 0.8})`;
      c.fillRect(p.X - size / 2, p.Y - size / 2, size, size);
    }
  });

  return <canvas ref={ref} className="h-full w-full cursor-grab touch-none active:cursor-grabbing" />;
}

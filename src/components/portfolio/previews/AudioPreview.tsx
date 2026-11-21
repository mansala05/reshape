import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { isReducedMotion } from "@/lib/motion";
import { rgb } from "@/lib/palette";
import { useCanvasLoop } from "./use-canvas-loop";

const BARS = 96;
const NOTES = [0, 3, 7, 10, 12, 10, 7, 3, 0, 5, 8, 12, 15, 12, 8, 5];

type Engine = {
  ctx: AudioContext;
  analyser: AnalyserNode;
  data: Uint8Array<ArrayBuffer>;
  lead: OscillatorNode;
  filter: BiquadFilterNode;
  timer: number;
  stop: () => void;
};

export function AudioPreview({ interactive = true }: { interactive?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const engine = useRef<Engine | null>(null);
  const smooth = useRef(new Float32Array(BARS));
  const pitch = useRef(0);

  const start = () => {
    const AC = window.AudioContext;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 0.12;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.78;
    master.connect(analyser);
    analyser.connect(ctx.destination);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1800;
    filter.Q.value = 8;
    filter.connect(master);

    const bass = ctx.createOscillator();
    bass.type = "sawtooth";
    bass.frequency.value = 55;
    const bassGain = ctx.createGain();
    bassGain.gain.value = 0.5;
    bass.connect(bassGain).connect(filter);

    const lead = ctx.createOscillator();
    lead.type = "square";
    lead.frequency.value = 220;
    const leadGain = ctx.createGain();
    leadGain.gain.value = 0;
    lead.connect(leadGain).connect(filter);

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.25;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 900;
    lfo.connect(lfoGain).connect(filter.frequency);

    bass.start();
    lead.start();
    lfo.start();

    let step = 0;
    const timer = window.setInterval(() => {
      const t = ctx.currentTime;
      const semi = NOTES[step % NOTES.length]! + Math.round(pitch.current * 12);
      lead.frequency.setValueAtTime(220 * Math.pow(2, semi / 12), t);
      leadGain.gain.cancelScheduledValues(t);
      leadGain.gain.setValueAtTime(0.35, t);
      leadGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      if (step % 4 === 0) {
        bassGain.gain.setValueAtTime(0.7, t);
        bassGain.gain.exponentialRampToValueAtTime(0.2, t + 0.3);
      }
      step++;
    }, 170);

    engine.current = {
      ctx,
      analyser,
      data: new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount)),
      lead,
      filter,
      timer,
      stop: () => {
        window.clearInterval(timer);
        void ctx.close();
      },
    };
    setPlaying(true);
  };

  const stop = () => {
    engine.current?.stop();
    engine.current = null;
    setPlaying(false);
  };

  useEffect(() => () => engine.current?.stop(), []);

  const ref = useCanvasLoop(({ w, h, dpr, t, pointer }) => {
    const c = ref.current?.getContext("2d");
    if (!c) return;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = `rgba(${rgb.raven.join(",")},0.35)`;
    c.fillRect(0, 0, w, h);

    if (pointer.inside) {
      pitch.current = pointer.x / w - 0.5;
      if (engine.current) engine.current.filter.Q.value = 2 + (1 - pointer.y / h) * 14;
    }

    const calm = isReducedMotion();
    const e = engine.current;
    if (e) e.analyser.getByteFrequencyData(e.data);
    const cx = w / 2;
    const cy = h / 2;
    const base = Math.min(w, h) * 0.2;
    const s = smooth.current;
    let energy = 0;

    for (let i = 0; i < BARS; i++) {
      const mirrored = i < BARS / 2 ? i : BARS - 1 - i;
      const raw = e
        ? (e.data[Math.floor((mirrored / (BARS / 2)) * 120) + 2] ?? 0) / 255
        : 0.15 + 0.12 * Math.sin(t * (calm ? 0.5 : 2) + i * 0.35) * Math.sin(t * 0.7 + i * 0.11);
      s[i] = s[i]! + (raw - s[i]!) * (calm ? 0.12 : 0.3);
      energy += s[i]!;
    }
    energy /= BARS;

    // Core
    const glow = c.createRadialGradient(cx, cy, 0, cx, cy, base * (1.4 + energy));
    glow.addColorStop(0, `rgba(${rgb.poppy.join(",")},${0.25 + energy * 0.5})`);
    glow.addColorStop(1, `rgba(${rgb.poppy.join(",")},0)`);
    c.fillStyle = glow;
    c.beginPath();
    c.arc(cx, cy, base * 2, 0, Math.PI * 2);
    c.fill();

    c.lineCap = "round";
    for (let i = 0; i < BARS; i++) {
      const a = (i / BARS) * Math.PI * 2 + (calm ? 0 : t * 0.15);
      const v = s[i]!;
      const len = 6 + v * base * 1.6;
      const r0 = base * (0.9 + energy * 0.3);
      const x0 = cx + Math.cos(a) * r0;
      const y0 = cy + Math.sin(a) * r0;
      const x1 = cx + Math.cos(a) * (r0 + len);
      const y1 = cy + Math.sin(a) * (r0 + len);
      const hot = v > 0.62;
      c.strokeStyle = hot ? `rgba(${rgb.poppy.join(",")},0.95)` : `rgba(${rgb.powder.join(",")},${0.35 + v * 0.6})`;
      c.lineWidth = Math.max(1.5, (Math.PI * 2 * r0) / BARS - 2);
      c.beginPath();
      c.moveTo(x0, y0);
      c.lineTo(x1, y1);
      c.stroke();
    }

    c.strokeStyle = `rgba(${rgb.powder.join(",")},0.25)`;
    c.lineWidth = 1;
    c.beginPath();
    c.arc(cx, cy, base * 0.75, 0, Math.PI * 2);
    c.stroke();
  });

  return (
    <div className="relative h-full w-full">
      <canvas ref={ref} className="h-full w-full" />
      {interactive && (
        <button
          type="button"
          onClick={playing ? stop : start}
          className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 font-mono text-xs uppercase tracking-widest text-foreground backdrop-blur transition hover:border-poppy hover:text-poppy-bright"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {playing ? "Stop" : "Play track"}
        </button>
      )}
    </div>
  );
}

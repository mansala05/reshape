import { getUI } from "./ui-store";

/** Tiny synthesized UI sound kit. Silent unless the sound toggle is on. */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function ensure() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.18;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

type Kind = "tick" | "click" | "open" | "close" | "success" | "ripple" | "toggle";

const presets: Record<
  Kind,
  { f: number; f2?: number; d: number; type: OscillatorType; g: number }
> = {
  tick: { f: 2400, d: 0.03, type: "sine", g: 0.12 },
  click: { f: 900, f2: 500, d: 0.07, type: "triangle", g: 0.35 },
  open: { f: 420, f2: 840, d: 0.18, type: "sine", g: 0.35 },
  close: { f: 700, f2: 300, d: 0.14, type: "sine", g: 0.3 },
  success: { f: 660, f2: 1320, d: 0.22, type: "triangle", g: 0.3 },
  ripple: { f: 140, f2: 55, d: 0.45, type: "sine", g: 0.9 },
  toggle: { f: 520, f2: 1040, d: 0.12, type: "square", g: 0.12 },
};

export function playSound(kind: Kind, force = false) {
  if (!force && !getUI().soundOn) return;
  const ac = ensure();
  if (!ac || !master) return;
  const p = presets[kind];
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = p.type;
  osc.frequency.setValueAtTime(p.f, t);
  if (p.f2) osc.frequency.exponentialRampToValueAtTime(p.f2, t + p.d);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(p.g, t + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + p.d);
  osc.connect(gain).connect(master);
  osc.start(t);
  osc.stop(t + p.d + 0.02);
}

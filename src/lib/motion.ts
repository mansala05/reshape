import { heroInput } from "./hero-input";
import { getUI, setUI } from "./ui-store";

/**
 * Reduced-motion mode. Follows the operating system setting until the visitor
 * picks a mode themselves; that choice is remembered in localStorage.
 */

export type MotionPreference = "reduced" | "full" | null;

const KEY = "motion-preference";
const QUERY = "(prefers-reduced-motion: reduce)";

export function resolveReducedMotion(stored: MotionPreference, systemPrefersReduced: boolean): boolean {
  if (stored === "reduced") return true;
  if (stored === "full") return false;
  return systemPrefersReduced;
}

function readStored(): MotionPreference {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "reduced" || v === "full" ? v : null;
  } catch {
    return null;
  }
}

function apply(reduced: boolean, source: "system" | "user") {
  heroInput.reduced = reduced;
  document.documentElement.classList.toggle("reduce-motion", reduced);
  document.documentElement.classList.add("motion-ready");
  setUI({ reducedMotion: reduced, motionSource: source });
}

/** Call once from an effect. Returns a cleanup that stops following the system setting. */
export function initMotion(): () => void {
  const mql = window.matchMedia(QUERY);
  const sync = () => {
    const stored = readStored();
    apply(resolveReducedMotion(stored, mql.matches), stored ? "user" : "system");
  };
  sync();
  mql.addEventListener("change", sync);
  return () => mql.removeEventListener("change", sync);
}

export function setReducedMotion(reduced: boolean) {
  try {
    window.localStorage.setItem(KEY, reduced ? "reduced" : "full");
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }
  apply(reduced, "user");
}

/** Go back to following the operating system setting. */
export function followSystemMotion() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  apply(window.matchMedia(QUERY).matches, "system");
}

export function isReducedMotion() {
  return getUI().reducedMotion;
}

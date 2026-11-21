import { useSyncExternalStore } from "react";

type UIState = {
  paletteOpen: boolean;
  statsOpen: boolean;
  soundOn: boolean;
  projectId: string | null;
  posterId: string | null;
  reducedMotion: boolean;
  motionSource: "system" | "user";
};

const initial: UIState = {
  paletteOpen: false,
  statsOpen: false,
  soundOn: false,
  projectId: null,
  posterId: null,
  reducedMotion: false,
  motionSource: "system",
};
let state: UIState = initial;
const listeners = new Set<() => void>();

export function getUI() {
  return state;
}

export function setUI(patch: Partial<UIState> | ((s: UIState) => Partial<UIState>)) {
  const next = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useUI<T>(select: (s: UIState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => select(state),
    () => select(initial),
  );
}

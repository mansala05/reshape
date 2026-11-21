/**
 * Raw color values for WebGL and canvas drawing, which cannot read CSS tokens.
 * Keep these in sync with the tokens in src/styles.css.
 */
export const palette = {
  raven: "#0c0d10",
  ravenSoft: "#14161b",
  ravenLift: "#1c1f26",
  powder: "#a4c8e1",
  powderDeep: "#5f8fb3",
  poppy: "#e63946",
  poppyBright: "#ff3344",
  ink: "#eef2f6",
  mute: "#8a92a0",
} as const;

export const rgb = {
  raven: [12, 13, 16],
  powder: [164, 200, 225],
  poppy: [255, 51, 68],
  ink: [238, 242, 246],
} as const;

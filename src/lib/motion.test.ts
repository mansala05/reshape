import { describe, expect, it } from "vitest";

import { resolveReducedMotion } from "./motion";

describe("reduced-motion preference", () => {
  it("follows the operating system when the visitor has not chosen", () => {
    expect(resolveReducedMotion(null, true)).toBe(true);
    expect(resolveReducedMotion(null, false)).toBe(false);
  });

  it("uses reduced motion when the visitor turned it on, even if the system does not ask for it", () => {
    expect(resolveReducedMotion("reduced", false)).toBe(true);
  });

  it("uses full motion when the visitor turned reduced motion off, even if the system asks for it", () => {
    expect(resolveReducedMotion("full", true)).toBe(false);
  });
});

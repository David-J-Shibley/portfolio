import { describe, expect, it } from "vitest";
import { defaultLayout } from "./layout";
import { pairDeck } from "./tiles";

describe("defaultLayout", () => {
  it("has 36 slots matching pair deck", () => {
    const p = defaultLayout();
    expect(p).toHaveLength(36);
    expect(pairDeck()).toHaveLength(36);
  });

  it("uses unique (z,x,y) per slot", () => {
    const p = defaultLayout();
    const key = (x: { z: number; x: number; y: number }) =>
      `${x.z},${x.x},${x.y}`;
    expect(new Set(p.map(key)).size).toBe(36);
  });
});

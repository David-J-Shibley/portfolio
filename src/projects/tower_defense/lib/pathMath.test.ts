import { describe, expect, it } from "vitest";
import { MAPS } from "./maps";
import { buildPathMeta, positionOnPath } from "./pathMath";

describe("positionOnPath", () => {
  const { path, pathMeta } = MAPS.meander;

  it("starts at path start", () => {
    const p = positionOnPath(pathMeta, 0);
    expect(Math.abs(p.x - path[0]!.x)).toBeLessThan(0.01);
    expect(Math.abs(p.y - path[0]!.y)).toBeLessThan(0.01);
  });

  it("ends at path end", () => {
    const p = positionOnPath(pathMeta, 1);
    const last = path[path.length - 1]!;
    expect(Math.hypot(p.x - last.x, p.y - last.y)).toBeLessThan(2);
  });

  it("buildPathMeta total matches segments", () => {
    const m = buildPathMeta(path);
    const sum = m.segments.reduce((s, x) => s + x.len, 0);
    expect(m.total).toBeCloseTo(sum, 5);
  });
});

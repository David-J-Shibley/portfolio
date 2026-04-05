import { describe, expect, it } from "vitest";
import {
  MAX_TOWER_LEVEL,
  towerStatsForLevel,
  upgradeCostForLevel,
} from "./constants";

describe("towerStatsForLevel", () => {
  it("level 1 matches base dart damage", () => {
    expect(towerStatsForLevel("dart", 1).damage).toBeCloseTo(11, 5);
  });

  it("blast has splash that grows with level", () => {
    const a = towerStatsForLevel("blast", 1);
    const b = towerStatsForLevel("blast", 3);
    const c = towerStatsForLevel("blast", MAX_TOWER_LEVEL);
    expect(a.splashRadius).toBeGreaterThan(0);
    expect(a.splashDamageRatio).toBeGreaterThan(0);
    expect(b.splashRadius!).toBeGreaterThan(a.splashRadius!);
    expect(b.splashDamageRatio!).toBeGreaterThanOrEqual(a.splashDamageRatio!);
    expect(c.damage).toBeGreaterThan(b.damage);
    expect(c.splashRadius!).toBeGreaterThan(b.splashRadius!);
  });

  it("caps at MAX_TOWER_LEVEL", () => {
    const a = towerStatsForLevel("dart", MAX_TOWER_LEVEL);
    const b = towerStatsForLevel("dart", 99);
    expect(a.damage).toBe(b.damage);
  });
});

describe("upgradeCostForLevel", () => {
  it("returns Infinity at max level", () => {
    expect(upgradeCostForLevel("dart", MAX_TOWER_LEVEL)).toBe(Infinity);
  });

  it("increases with current level", () => {
    const c1 = upgradeCostForLevel("dart", 1);
    const c2 = upgradeCostForLevel("dart", 2);
    expect(c2).toBeGreaterThan(c1);
  });

  it("late upgrades cost much more than early ones", () => {
    const early = upgradeCostForLevel("dart", 1);
    const late = upgradeCostForLevel("dart", 8);
    expect(late).toBeGreaterThan(early * 3);
  });
});

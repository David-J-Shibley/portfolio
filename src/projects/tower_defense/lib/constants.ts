export const W = 720;
export const H = 400;

export type TowerKind = "dart" | "blast" | "frost";

export const TOWER_STATS: Record<
  TowerKind,
  {
    name: string;
    cost: number;
    range: number;
    damage: number;
    cooldown: number;
    projectileSpeed: number;
    /** Blast only: AoE radius (px) at impact; other enemies take `splashDamageRatio` of damage. */
    splashRadius?: number;
    splashDamageRatio?: number;
    slowMul?: number;
    slowDuration?: number;
    hue: number;
  }
> = {
  dart: {
    name: "Dart",
    cost: 55,
    range: 118,
    damage: 11,
    cooldown: 0.38,
    projectileSpeed: 420,
    hue: 210,
  },
  blast: {
    name: "Blast",
    cost: 130,
    range: 92,
    damage: 38,
    cooldown: 1.35,
    projectileSpeed: 280,
    splashRadius: 78,
    splashDamageRatio: 0.55,
    hue: 28,
  },
  frost: {
    name: "Frost",
    cost: 95,
    range: 105,
    damage: 7,
    cooldown: 0.55,
    projectileSpeed: 360,
    slowMul: 0.45,
    slowDuration: 2.2,
    hue: 195,
  },
};

/**
 * 1 = freshly built. Higher cap keeps gold useful through Act II; upgrade costs ramp up.
 */
export const MAX_TOWER_LEVEL = 10;

export type TowerCombatStats = {
  range: number;
  damage: number;
  cooldown: number;
  projectileSpeed: number;
  splashRadius?: number;
  splashDamageRatio?: number;
  slowMul?: number;
  slowDuration?: number;
};

/** Gold to upgrade from `currentLevel` → `currentLevel + 1`. Quadratic ramp = late sinks. */
export function upgradeCostForLevel(
  kind: TowerKind,
  currentLevel: number,
): number {
  if (currentLevel >= MAX_TOWER_LEVEL) return Infinity;
  const base = TOWER_STATS[kind].cost;
  const tier = currentLevel;
  return Math.floor(
    base * (0.36 + 0.17 * tier + 0.034 * tier * tier),
  );
}

/**
 * Stats at 1-based level. First three jumps match the old game (≈Lv1–3); later steps taper
 * so level 10 is strong without breaking waves.
 */
export function towerStatsForLevel(
  kind: TowerKind,
  level: number,
): TowerCombatStats {
  const base = TOWER_STATS[kind];
  const lv = Math.max(1, Math.min(level, MAX_TOWER_LEVEL));
  const steps = lv - 1;
  const sEarly = Math.min(steps, 3);
  const sLate = Math.max(0, steps - 3);

  return {
    range: base.range * (1 + 0.12 * sEarly + 0.035 * sLate),
    damage: base.damage * (1 + 0.33 * sEarly + 0.09 * sLate),
    cooldown: base.cooldown * 0.88 ** sEarly * 0.965 ** sLate,
    projectileSpeed:
      base.projectileSpeed * (1 + 0.055 * sEarly + 0.025 * sLate),
    splashRadius:
      base.splashRadius != null
        ? base.splashRadius * (1 + 0.1 * sEarly + 0.04 * sLate)
        : undefined,
    splashDamageRatio:
      base.splashDamageRatio != null
        ? Math.min(
            0.88,
            base.splashDamageRatio + 0.055 * sEarly + 0.025 * sLate,
          )
        : undefined,
    slowMul:
      base.slowMul != null
        ? base.slowMul * 0.92 ** sEarly * 0.97 ** sLate
        : undefined,
    slowDuration:
      base.slowDuration != null
        ? base.slowDuration * (1 + 0.14 * sEarly + 0.05 * sLate)
        : undefined,
  };
}

export type WaveDef = {
  count: number;
  interval: number;
  baseHp: number;
  speed: number;
  reward: number;
};

export const WAVES: WaveDef[] = [
  { count: 6, interval: 1.0, baseHp: 28, speed: 0.11, reward: 7 },
  { count: 9, interval: 0.85, baseHp: 36, speed: 0.12, reward: 8 },
  { count: 12, interval: 0.7, baseHp: 48, speed: 0.125, reward: 9 },
  { count: 14, interval: 0.6, baseHp: 62, speed: 0.13, reward: 10 },
  { count: 16, interval: 0.55, baseHp: 78, speed: 0.135, reward: 11 },
  { count: 20, interval: 0.5, baseHp: 95, speed: 0.14, reward: 12 },
  { count: 24, interval: 0.45, baseHp: 115, speed: 0.145, reward: 13 },
  { count: 28, interval: 0.4, baseHp: 140, speed: 0.15, reward: 14 },
  /* Act II — tuned off wave 8 so economy and upgrades stay viable */
  { count: 30, interval: 0.38, baseHp: 165, speed: 0.151, reward: 15 },
  { count: 33, interval: 0.36, baseHp: 192, speed: 0.153, reward: 16 },
  { count: 36, interval: 0.34, baseHp: 222, speed: 0.156, reward: 17 },
  { count: 39, interval: 0.32, baseHp: 255, speed: 0.159, reward: 18 },
  { count: 42, interval: 0.3, baseHp: 290, speed: 0.162, reward: 19 },
  { count: 45, interval: 0.29, baseHp: 328, speed: 0.165, reward: 20 },
  { count: 48, interval: 0.28, baseHp: 368, speed: 0.168, reward: 21 },
  { count: 52, interval: 0.27, baseHp: 410, speed: 0.171, reward: 22 },
  { count: 55, interval: 0.26, baseHp: 455, speed: 0.173, reward: 23 },
  { count: 58, interval: 0.25, baseHp: 502, speed: 0.175, reward: 24 },
  { count: 62, interval: 0.24, baseHp: 552, speed: 0.177, reward: 25 },
  { count: 65, interval: 0.23, baseHp: 605, speed: 0.179, reward: 26 },
];

export const START_GOLD = 140;
export const START_LIVES = 18;
export const SLOT_HIT_R = 26;

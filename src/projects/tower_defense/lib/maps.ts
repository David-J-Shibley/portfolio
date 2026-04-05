import { buildPathMeta, type PathMeta, type Vec } from "./pathMath";

export type MapId = "meander" | "zigzag" | "switchback" | "ridgeline";

export type GameMapDef = {
  id: MapId;
  name: string;
  blurb: string;
  path: Vec[];
  buildSlots: Vec[];
  pathMeta: PathMeta;
};

function make(
  id: MapId,
  name: string,
  blurb: string,
  path: Vec[],
  buildSlots: Vec[],
): GameMapDef {
  return { id, name, blurb, path, buildSlots, pathMeta: buildPathMeta(path) };
}

/** Original winding route — balanced sightlines on inner bends. */
const meander = make(
  "meander",
  "Riverbend",
  "Classic S-curve along the old road.",
  [
    { x: -30, y: 200 },
    { x: 100, y: 200 },
    { x: 160, y: 200 },
    { x: 220, y: 120 },
    { x: 320, y: 120 },
    { x: 380, y: 220 },
    { x: 480, y: 220 },
    { x: 540, y: 140 },
    { x: 640, y: 140 },
    { x: 750, y: 200 },
  ],
  [
    { x: 130, y: 280 },
    { x: 260, y: 60 },
    { x: 350, y: 260 },
    { x: 430, y: 80 },
    { x: 510, y: 320 },
    { x: 590, y: 60 },
    { x: 200, y: 150 },
    { x: 460, y: 150 },
  ],
);

/** Tall vertical swings — favors long-range and corner stacks. */
const zigzag = make(
  "zigzag",
  "Highswitch",
  "Steep north–south legs; choke the turns.",
  [
    { x: -30, y: 200 },
    { x: 140, y: 200 },
    { x: 220, y: 55 },
    { x: 380, y: 55 },
    { x: 460, y: 345 },
    { x: 580, y: 345 },
    { x: 660, y: 90 },
    { x: 750, y: 90 },
  ],
  [
    { x: 100, y: 320 },
    { x: 300, y: 140 },
    { x: 520, y: 220 },
    { x: 620, y: 60 },
    { x: 200, y: 200 },
    { x: 400, y: 200 },
    { x: 320, y: 320 },
    { x: 540, y: 80 },
  ],
);

/** Double-back valley — two long parallel runs. */
const switchback = make(
  "switchback",
  "Twin trench",
  "Enemies double back; you split coverage east and west.",
  [
    { x: -30, y: 320 },
    { x: 180, y: 320 },
    { x: 260, y: 90 },
    { x: 420, y: 90 },
    { x: 500, y: 310 },
    { x: 620, y: 310 },
    { x: 700, y: 120 },
    { x: 750, y: 120 },
  ],
  [
    { x: 120, y: 200 },
    { x: 340, y: 200 },
    { x: 220, y: 45 },
    { x: 460, y: 200 },
    { x: 560, y: 200 },
    { x: 340, y: 350 },
    { x: 640, y: 45 },
    { x: 600, y: 350 },
  ],
);

/** Long floor crawl then cliff exit — timing-heavy. */
const ridgeline = make(
  "ridgeline",
  "Lowline",
  "A crawl across the bottom, then a sharp climb to the gate.",
  [
    { x: -30, y: 350 },
    { x: 200, y: 350 },
    { x: 520, y: 350 },
    { x: 520, y: 55 },
    { x: 680, y: 55 },
    { x: 750, y: 55 },
  ],
  [
    { x: 120, y: 260 },
    { x: 280, y: 260 },
    { x: 400, y: 260 },
    { x: 620, y: 260 },
    { x: 360, y: 140 },
    { x: 520, y: 140 },
    { x: 620, y: 140 },
    { x: 440, y: 45 },
  ],
);

export const MAPS: Record<MapId, GameMapDef> = {
  meander,
  zigzag,
  switchback,
  ridgeline,
};

export const MAP_ORDER: MapId[] = [
  "meander",
  "zigzag",
  "switchback",
  "ridgeline",
];

export const DEFAULT_MAP_ID: MapId = "meander";

export function getMap(id: MapId): GameMapDef {
  return MAPS[id];
}

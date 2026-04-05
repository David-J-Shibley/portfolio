import type { GridPos } from "./types";

/**
 * 36 stacked slots (Shanghai-style): same (x,y) may repeat at higher z = stacked.
 */
export function defaultLayout(): GridPos[] {
  const out: GridPos[] = [];
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 5; x++) {
      out.push({ z: 0, x, y });
    }
  }
  for (let y = 1; y < 3; y++) {
    for (let x = 1; x < 4; x++) {
      out.push({ z: 1, x, y });
    }
  }
  for (let y = 1; y < 3; y++) {
    for (let x = 2; x < 4; x++) {
      out.push({ z: 2, x, y });
    }
  }
  out.push(
    { z: 3, x: 2, y: 1 },
    { z: 3, x: 3, y: 1 },
    { z: 3, x: 2, y: 2 },
    { z: 3, x: 3, y: 2 },
  );
  out.push({ z: 4, x: 2, y: 1 }, { z: 4, x: 3, y: 1 });
  return out;
}

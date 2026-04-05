export type Vec = { x: number; y: number };

export type PathMeta = {
  segments: {
    len: number;
    ax: number;
    ay: number;
    bx: number;
    by: number;
  }[];
  total: number;
};

export function buildPathMeta(path: Vec[]): PathMeta {
  const segments: PathMeta["segments"] = [];
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i]!;
    const b = path[i + 1]!;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    segments.push({ len, ax: a.x, ay: a.y, bx: b.x, by: b.y });
    total += len;
  }
  return { segments, total };
}

/** `u` in [0,1] = progress along full path length. */
export function positionOnPath(meta: PathMeta, u: number): Vec {
  const dist = Math.max(0, Math.min(1, u)) * meta.total;
  let acc = 0;
  for (const s of meta.segments) {
    if (acc + s.len >= dist) {
      const t = s.len > 0 ? (dist - acc) / s.len : 0;
      return {
        x: s.ax + (s.bx - s.ax) * t,
        y: s.ay + (s.by - s.ay) * t,
      };
    }
    acc += s.len;
  }
  const last = meta.segments[meta.segments.length - 1]!;
  return { x: last.bx, y: last.by };
}

export function distSq(a: Vec, b: Vec): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

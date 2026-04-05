import type { BoardTile } from "./types";

export function isCovered(t: BoardTile, board: BoardTile[]): boolean {
  return board.some((u) => u.z > t.z && u.x === t.x && u.y === t.y);
}

export function hasNeighborLeft(t: BoardTile, board: BoardTile[]): boolean {
  return board.some(
    (u) => u.z === t.z && u.y === t.y && u.x === t.x - 1,
  );
}

export function hasNeighborRight(t: BoardTile, board: BoardTile[]): boolean {
  return board.some(
    (u) => u.z === t.z && u.y === t.y && u.x === t.x + 1,
  );
}

/** Open if not covered from above and at least one horizontal side is open for sliding. */
export function isTileFree(t: BoardTile, board: BoardTile[]): boolean {
  if (isCovered(t, board)) return false;
  const L = hasNeighborLeft(t, board);
  const R = hasNeighborRight(t, board);
  return !(L && R);
}

export function findFreeTiles(board: BoardTile[]): BoardTile[] {
  return board.filter((t) => isTileFree(t, board));
}

/** Any two free tiles share a kind (pair available). */
export function hasMatchingFreePair(board: BoardTile[]): boolean {
  const free = findFreeTiles(board);
  const byKind = new Map<string, number>();
  for (const t of free) {
    byKind.set(t.kind, (byKind.get(t.kind) ?? 0) + 1);
    if ((byKind.get(t.kind) ?? 0) >= 2) return true;
  }
  return false;
}

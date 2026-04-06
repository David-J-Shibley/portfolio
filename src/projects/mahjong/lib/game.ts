import { defaultLayout } from "./layout";
import { pairDeck } from "./tiles";
import type { BoardTile, TileKind } from "./types";
import { isTileFree } from "./rules";

export function cloneBoard(tiles: BoardTile[]): BoardTile[] {
  return tiles.map((t) => ({ ...t }));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function createBoard(): BoardTile[] {
  const layout = defaultLayout();
  const kinds = shuffle(pairDeck());
  if (layout.length !== kinds.length) {
    throw new Error("layout/kind count mismatch");
  }
  const stamp = Date.now();
  return layout.map((pos, i) => ({
    id: `t-${stamp}-${i}`,
    kind: kinds[i]!,
    z: pos.z,
    x: pos.x,
    y: pos.y,
  }));
}

/** Same positions; new random assignment of remaining kinds (escape dead ends). */
export function reshuffleKinds(tiles: BoardTile[]): BoardTile[] {
  const kinds = shuffle(tiles.map((t) => t.kind));
  return tiles.map((t, i) => ({ ...t, kind: kinds[i]! }));
}

export function trySelect(
  board: BoardTile[],
  selectedId: string | null,
  clickedId: string,
): {
  board: BoardTile[];
  selectedId: string | null;
  matched: boolean;
  invalid: boolean;
} {
  const clicked = board.find((t) => t.id === clickedId);
  if (!clicked || !isTileFree(clicked, board)) {
    return { board, selectedId, matched: false, invalid: true };
  }

  if (selectedId === null || selectedId === clickedId) {
    return {
      board,
      selectedId: selectedId === clickedId ? null : clickedId,
      matched: false,
      invalid: false,
    };
  }

  const first = board.find((t) => t.id === selectedId);
  if (!first || !isTileFree(first, board)) {
    return { board, selectedId: clickedId, matched: false, invalid: false };
  }

  if (first.kind !== clicked.kind) {
    return { board, selectedId: clickedId, matched: false, invalid: false };
  }

  const next = board.filter((t) => t.id !== first.id && t.id !== clicked.id);
  return { board: next, selectedId: null, matched: true, invalid: false };
}

export function hintPair(board: BoardTile[]): [string, string] | null {
  const free = board.filter((t) => isTileFree(t, board));
  const byKind = new Map<TileKind, string[]>();
  for (const t of free) {
    const list = byKind.get(t.kind) ?? [];
    list.push(t.id);
    byKind.set(t.kind, list);
    if (list.length >= 2) return [list[0]!, list[1]!];
  }
  return null;
}

import { describe, expect, it } from "vitest";
import { createBoard, reshuffleKinds, trySelect } from "./game";
import type { BoardTile } from "./types";

describe("createBoard", () => {
  it("creates 36 tiles with paired kinds", () => {
    const b = createBoard();
    expect(b).toHaveLength(36);
    const counts = new Map<string, number>();
    for (const t of b) {
      counts.set(t.kind, (counts.get(t.kind) ?? 0) + 1);
    }
    for (const n of counts.values()) {
      expect(n).toBe(2);
    }
  });
});

describe("trySelect", () => {
  it("removes a matching free pair", () => {
    const board: BoardTile[] = [
      { id: "a", kind: "b1", z: 0, x: 0, y: 0 },
      { id: "b", kind: "b1", z: 0, x: 4, y: 0 },
    ];
    const s1 = trySelect(board, null, "a");
    expect(s1.selectedId).toBe("a");
    const s2 = trySelect(s1.board, s1.selectedId, "b");
    expect(s2.matched).toBe(true);
    expect(s2.board).toHaveLength(0);
  });

  it("rejects selecting a covered tile", () => {
    const board: BoardTile[] = [
      { id: "a", kind: "b1", z: 0, x: 2, y: 2 },
      { id: "b", kind: "b2", z: 3, x: 2, y: 2 },
    ];
    const r = trySelect(board, null, "a");
    expect(r.invalid).toBe(true);
    expect(r.board).toHaveLength(2);
  });
});

describe("reshuffleKinds", () => {
  it("permutes kinds and preserves count", () => {
    const b = createBoard();
    const next = reshuffleKinds(b);
    expect(next).toHaveLength(b.length);
    const kindsBefore = [...b.map((t) => t.kind)].sort().join();
    const kindsAfter = [...next.map((t) => t.kind)].sort().join();
    expect(kindsAfter).toBe(kindsBefore);
  });
});

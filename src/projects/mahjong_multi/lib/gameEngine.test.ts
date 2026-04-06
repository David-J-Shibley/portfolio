import { describe, expect, it } from "vitest";
import { discardTile, drawFromWall, initialState } from "./gameEngine";

describe("gameEngine", () => {
  it("starts with dealer must discard", () => {
    const s = initialState();
    expect(s.phase).toEqual({ type: "must_discard", player: 0 });
    expect(s.hands[0]!.length).toBe(14);
    expect(s.hands[1]!.length).toBe(13);
    expect(s.wall.length).toBe(83);
  });

  it("after discard moves to next player draw", () => {
    const s0 = initialState();
    const s1 = discardTile(s0, 0);
    expect(s1.phase).toEqual({ type: "ready_to_draw", player: 1 });
    expect(s1.hands[0]!.length).toBe(13);
  });

  it("draw then must discard with 14 tiles", () => {
    let s = initialState();
    s = discardTile(s, 0);
    expect(s.phase.type).toBe("ready_to_draw");
    s = drawFromWall(s);
    expect(s.phase).toEqual({ type: "must_discard", player: 1 });
    expect(s.hands[1]!.length).toBe(14);
  });
});

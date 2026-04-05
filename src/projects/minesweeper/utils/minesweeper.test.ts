import { describe, expect, it } from "vitest";
import {
  checkWin,
  chordCell,
  DIFFICULTIES,
  emptyBoard,
  minesToBoard,
  placeMines,
  revealCell,
  toggleFlag,
} from "./minesweeper";

describe("placeMines", () => {
  it("never places mines in 3x3 safe zone", () => {
    const rows = 9;
    const cols = 9;
    const safeR = 4;
    const safeC = 4;
    const mines = placeMines(rows, cols, 20, safeR, safeC);
    let count = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (mines[r][c]) count++;
        if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) {
          expect(mines[r][c]).toBe(false);
        }
      }
    }
    expect(count).toBeLessThanOrEqual(20);
  });

  it("places no mines when the whole board is the safe zone", () => {
    const mines = placeMines(3, 3, 99, 1, 1);
    const n = mines.flat().filter(Boolean).length;
    expect(n).toBe(0);
  });
});

describe("revealCell", () => {
  it("reveals single number cell", () => {
    const mines = [
      [true, false, false],
      [false, false, false],
      [false, false, false],
    ];
    const board = minesToBoard(mines);
    const { board: after, hitMine } = revealCell(board, 1, 1);
    expect(hitMine).toBe(false);
    expect(after[1][1].state).toBe("revealed");
    expect(after[1][1].adjacent).toBeGreaterThanOrEqual(1);
  });

  it("hits mine when revealing mine", () => {
    const mines = [
      [true, false],
      [false, false],
    ];
    const board = minesToBoard(mines);
    const { hitMine } = revealCell(board, 0, 0);
    expect(hitMine).toBe(true);
  });
});

describe("toggleFlag", () => {
  it("toggles hidden to flagged and back", () => {
    let board = emptyBoard(2, 2);
    board = toggleFlag(board, 0, 0);
    expect(board[0][0].state).toBe("flagged");
    board = toggleFlag(board, 0, 0);
    expect(board[0][0].state).toBe("hidden");
  });
});

describe("checkWin", () => {
  it("is true when all safe cells revealed", () => {
    const mines = [
      [true, false],
      [false, false],
    ];
    const board = minesToBoard(mines);
    board[0][1].state = "revealed";
    board[1][0].state = "revealed";
    board[1][1].state = "revealed";
    expect(checkWin(board)).toBe(true);
  });

  it("is false with hidden safe cell", () => {
    const board = emptyBoard(2, 2);
    expect(checkWin(board)).toBe(false);
  });
});

describe("DIFFICULTIES", () => {
  it("has sane presets", () => {
    expect(DIFFICULTIES.beginner.rows).toBe(9);
    expect(DIFFICULTIES.expert.mines).toBe(99);
  });
});

describe("chordCell", () => {
  it("does nothing when counts mismatch", () => {
    const mines = [
      [true, false, false],
      [false, false, false],
      [false, false, false],
    ];
    const board = minesToBoard(mines);
    board[1][1].state = "revealed";
    const { board: after } = chordCell(board, 1, 1);
    expect(after[0][1].state).toBe("hidden");
  });
});

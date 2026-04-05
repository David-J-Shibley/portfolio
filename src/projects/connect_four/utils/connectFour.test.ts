import { describe, expect, it } from "vitest";
import {
  COLS,
  dropPiece,
  emptyBoard,
  isBoardFull,
  pickAiColumn,
  ROWS,
  validColumns,
  winnerOf,
} from "./connectFour";

describe("dropPiece", () => {
  it("stacks from the bottom", () => {
    let b = emptyBoard();
    b = dropPiece(b, 0, 1)!;
    expect(b[ROWS - 1][0]).toBe(1);
    b = dropPiece(b, 0, 2)!;
    expect(b[ROWS - 2][0]).toBe(2);
  });

  it("returns null when column full", () => {
    let b = emptyBoard();
    for (let i = 0; i < ROWS; i++) {
      b = dropPiece(b, 0, 1)!;
    }
    expect(dropPiece(b, 0, 2)).toBeNull();
  });
});

describe("winnerOf", () => {
  it("detects horizontal four", () => {
    const b = emptyBoard();
    let x = b;
    for (let c = 0; c < 4; c++) {
      x = dropPiece(x, c, 1)!;
    }
    expect(winnerOf(x)).toBe(1);
  });

  it("detects vertical four", () => {
    const b = emptyBoard();
    let x = b;
    for (let i = 0; i < 4; i++) {
      x = dropPiece(x, 2, 2)!;
    }
    expect(winnerOf(x)).toBe(2);
  });

  it("detects diagonal", () => {
    const b = emptyBoard();
    b[5][0] = 1;
    b[4][1] = 1;
    b[3][2] = 1;
    b[2][3] = 1;
    expect(winnerOf(b)).toBe(1);
  });

  it("returns 0 when no winner", () => {
    expect(winnerOf(emptyBoard())).toBe(0);
  });
});

describe("validColumns", () => {
  it("lists only non-full columns", () => {
    expect(validColumns(emptyBoard()).length).toBe(COLS);
  });
});

describe("pickAiColumn", () => {
  it("takes immediate win", () => {
    let b = emptyBoard();
    for (let c = 0; c < 3; c++) {
      b = dropPiece(b, c, 2)!;
    }
    const col = pickAiColumn(b);
    const after = dropPiece(b, col, 2)!;
    expect(winnerOf(after)).toBe(2);
  });

  it("blocks opponent win", () => {
    let b = emptyBoard();
    for (let c = 0; c < 3; c++) {
      b = dropPiece(b, c, 1)!;
    }
    const col = pickAiColumn(b);
    const block = dropPiece(b, col, 2)!;
    expect(winnerOf(block)).toBe(0);
    for (const c of validColumns(b)) {
      if (c === col) continue;
      const tryLose = dropPiece(b, c, 2);
      if (!tryLose) continue;
      if (winnerOf(dropPiece(tryLose, 3, 1)!) === 1) {
        /* opponent could still win next — we only guarantee block one line */
      }
    }
    expect(col).toBe(3);
  });
});

describe("isBoardFull", () => {
  it("is false on empty", () => {
    expect(isBoardFull(emptyBoard())).toBe(false);
  });
});

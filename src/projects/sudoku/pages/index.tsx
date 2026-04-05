import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Grid3x3, RotateCcw } from "lucide-react";
import { PageMeta } from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PUZZLES } from "../data/puzzles";
import {
  cloneGrid,
  conflictKeys,
  isGivenMask,
  isSolved,
  parsePuzzle,
  type Grid,
} from "../utils/sudoku";

import "./index.css";

function loadPuzzle(index: number): { grid: Grid; given: boolean[][] } {
  const line = PUZZLES[index % PUZZLES.length]!;
  const grid = parsePuzzle(line);
  return { grid, given: isGivenMask(grid) };
}

export default function SudokuPage() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [{ grid, given }, setPuzzle] = useState(() => loadPuzzle(0));
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(
    null,
  );
  const [wonOpen, setWonOpen] = useState(false);

  const conflicts = useMemo(() => conflictKeys(grid), [grid]);

  const newPuzzle = useCallback(() => {
    setPuzzleIndex((i) => {
      const next = (i + 1) % PUZZLES.length;
      setPuzzle(loadPuzzle(next));
      setSelected(null);
      setWonOpen(false);
      return next;
    });
  }, []);

  const setCell = useCallback(
    (r: number, c: number, val: number) => {
      if (given[r]![c]) return;
      setPuzzle((prev) => {
        const next = cloneGrid(prev.grid);
        next[r]![c] = val;
        return { ...prev, grid: next };
      });
    },
    [given],
  );

  useEffect(() => {
    if (isSolved(grid)) setWonOpen(true);
  }, [grid]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (wonOpen) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
        return;

      if (e.key === "Escape") {
        setSelected(null);
        return;
      }

      if (!selected) {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          setSelected({ r: 0, c: 0 });
        }
        return;
      }

      const { r, c } = selected;
      if (e.key === "ArrowUp" && r > 0) {
        setSelected({ r: r - 1, c });
        e.preventDefault();
        return;
      }
      if (e.key === "ArrowDown" && r < 8) {
        setSelected({ r: r + 1, c });
        e.preventDefault();
        return;
      }
      if (e.key === "ArrowLeft" && c > 0) {
        setSelected({ r, c: c - 1 });
        e.preventDefault();
        return;
      }
      if (e.key === "ArrowRight" && c < 8) {
        setSelected({ r, c: c + 1 });
        e.preventDefault();
        return;
      }

      if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
        setCell(r, c, 0);
        e.preventDefault();
        return;
      }

      const d = e.key >= "1" && e.key <= "9" ? Number.parseInt(e.key, 10) : NaN;
      if (!Number.isNaN(d)) {
        setCell(r, c, d);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, setCell, wonOpen]);

  const dismissWin = () => {
    setWonOpen(false);
    newPuzzle();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background px-4 pb-16 pt-24 text-foreground md:pt-28">
      <PageMeta
        title="Sudoku"
        description="Classic 9×9 Sudoku — fill the grid with digits 1–9."
        path="/sudoku"
      />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
            <Link to="/games">
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Games
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={newPuzzle}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Next puzzle
          </Button>
        </header>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Grid3x3 className="h-8 w-8 text-primary" aria-hidden />
            <h1 className="font-serif text-3xl font-semibold tracking-tight">
              Sudoku
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Each row, column, and 3×3 box must contain digits 1–9 exactly once.
            Puzzle {(puzzleIndex % PUZZLES.length) + 1} of {PUZZLES.length}.
          </p>
        </div>

        <div className="flex flex-col items-center gap-5">
          <div
            className="sudoku-root sudoku-board"
            role="grid"
            aria-label="Sudoku board"
          >
            {[0, 1, 2].map((br) => (
              <div key={br} className="sudoku-band" role="row">
                {[0, 1, 2].map((bc) => (
                  <div
                    key={bc}
                    className="sudoku-box"
                    role="group"
                    aria-label={`Block ${br * 3 + bc + 1}`}
                  >
                    {[0, 1, 2].flatMap((i) =>
                      [0, 1, 2].map((j) => {
                        const r = br * 3 + i;
                        const c = bc * 3 + j;
                        const v = grid[r]![c]!;
                        const isG = given[r]![c]!;
                        const key = `${r},${c}`;
                        const isSel = selected?.r === r && selected?.c === c;
                        const bad = conflicts.has(key);
                        return (
                          <button
                            key={key}
                            type="button"
                            role="gridcell"
                            aria-selected={isSel}
                            aria-current={isSel ? "true" : undefined}
                            className={[
                              "sudoku-cell",
                              isG && "sudoku-cell--given",
                              isSel && "sudoku-cell--selected",
                              bad && v !== 0 && "sudoku-cell--conflict",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            onClick={() =>
                              setSelected(isG ? null : { r, c })
                            }
                          >
                            {v === 0 ? "" : v}
                          </button>
                        );
                      }),
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="sudoku-numpad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <Button
                key={n}
                type="button"
                variant="outline"
                size="sm"
                disabled={!selected || given[selected.r]![selected.c]!}
                onClick={() => setCell(selected!.r, selected!.c, n)}
              >
                {n}
              </Button>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={!selected || given[selected.r]![selected.c]!}
              onClick={() => setCell(selected!.r, selected!.c, 0)}
            >
              Clear
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Use number keys, arrows to move, Backspace to clear. Click a cell to
            select.
          </p>
        </div>
      </div>

      <Dialog open={wonOpen} onOpenChange={setWonOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solved</DialogTitle>
            <DialogDescription>
              The grid is complete with no conflicts.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setWonOpen(false)}>
              Stay
            </Button>
            <Button type="button" onClick={dismissWin}>
              Next puzzle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

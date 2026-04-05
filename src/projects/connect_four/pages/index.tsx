import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, CircleDot, RotateCcw, Users } from "lucide-react";
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
import { useConnectFour, type ConnectMode } from "../hooks/useConnectFour";
import { COLS, ROWS, type Board } from "../utils/connectFour";

import "./index.css";

function nextEmptyRow(board: Board, col: number): number {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === 0) return r;
  }
  return -1;
}

export default function ConnectFourPage() {
  const {
    board,
    current,
    winner,
    draw,
    mode,
    setMode,
    play,
    reset,
    aiThinking,
  } = useConnectFour();

  const [hoverCol, setHoverCol] = useState<number | null>(null);

  const canPlay =
    winner === 0 &&
    !draw &&
    !(mode === "ai" && current === 2) &&
    !aiThinking;

  const showPreview =
    hoverCol !== null &&
    canPlay &&
    hoverCol >= 0 &&
    hoverCol < COLS &&
    board[0][hoverCol] === 0;

  const previewRow =
    showPreview && hoverCol !== null ? nextEmptyRow(board, hoverCol) : -1;

  return (
    <div className="cf-root min-h-[calc(100vh-4rem)] bg-background px-4 pb-16 pt-24 text-foreground md:pt-28">
      <PageMeta
        title="Connect Four"
        description="Drop discs to connect four in a row — two-player local or vs a simple AI."
        path="/connect4"
      />
      <div className="mx-auto flex max-w-lg flex-col gap-6">
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
            onClick={reset}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Reset
          </Button>
        </header>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <CircleDot className="h-8 w-8 text-primary" aria-hidden />
            <h1 className="font-serif text-3xl font-semibold tracking-tight">
              Connect Four
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Four in a row — horizontal, vertical, or diagonal. Red moves first.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="flex rounded-md border border-border bg-muted/40 p-0.5">
            {(
              [
                ["pvp", "2 players", Users],
                ["ai", "vs computer", CircleDot],
              ] as const
            ).map(([id, label, Icon]) => (
              <Button
                key={id}
                type="button"
                variant={mode === id ? "secondary" : "ghost"}
                size="sm"
                className="gap-1.5 rounded-sm px-3 text-xs sm:text-sm"
                onClick={() => setMode(id as ConnectMode)}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {label}
              </Button>
            ))}
          </div>
        </div>

        <p
          className="text-center text-sm font-medium text-muted-foreground"
          aria-live="polite"
        >
          {winner !== 0
            ? `${winner === 1 ? "Red" : "Yellow"} wins!`
            : draw
              ? "Draw — board is full."
              : aiThinking
                ? "Computer is thinking…"
                : `${current === 1 ? "Red" : "Yellow"} to play`}
        </p>

        <div className="flex w-full justify-center overflow-x-auto px-1">
          <div className="cf-board-wrap">
            <div className="cf-columns" role="grid" aria-label="Connect Four board">
              {Array.from({ length: COLS }, (_, col) => (
                <button
                  key={col}
                  type="button"
                  className="cf-col-btn"
                  disabled={!canPlay || board[0][col] !== 0}
                  aria-label={`Drop in column ${col + 1}`}
                  onMouseEnter={() => setHoverCol(col)}
                  onMouseLeave={() => setHoverCol(null)}
                  onFocus={() => setHoverCol(col)}
                  onBlur={() => setHoverCol(null)}
                  onClick={() => {
                    if (canPlay && board[0][col] === 0) play(col);
                  }}
                >
                  {Array.from({ length: ROWS }, (_, row) => {
                    const r = row;
                    const cell = board[r][col];
                    const isPreview =
                      showPreview &&
                      previewRow === r &&
                      hoverCol === col &&
                      cell === 0;
                    return (
                      <div
                        key={r}
                        className={`cf-cell ${isPreview ? "cf-preview" : ""}`}
                        role="gridcell"
                      >
                        {cell !== 0 ? (
                          <div
                            className={`cf-disc cf-disc--${cell}`}
                            aria-hidden
                          />
                        ) : isPreview ? (
                          <div
                            className={`cf-disc cf-disc--${current}`}
                            aria-hidden
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={winner !== 0} onOpenChange={(o) => !o && reset()}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {winner === 1 ? "Red wins!" : "Yellow wins!"}
            </DialogTitle>
            <DialogDescription>
              {winner === 2 && mode === "ai"
                ? "The computer connected four."
                : "Four in a row."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={reset}>
              Play again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={draw} onOpenChange={(o) => !o && reset()}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Draw</DialogTitle>
            <DialogDescription>The grid is full with no winner.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={reset}>
              Play again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Grid3x3,
  RotateCcw,
} from "lucide-react";
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
import { useGame2048 } from "../hooks/useGame2048";
import { WIN_VALUE } from "../utils/game2048";

import "./index.css";

const SWIPE_MIN = 42;

function tileClassName(value: number): string {
  if (value === 0) return "";
  if (value > 2048) return "game2048-tile game2048-tile--super";
  return `game2048-tile game2048-tile--${value}`;
}

export default function Game2048Page() {
  const {
    board,
    score,
    best,
    gameOver,
    won,
    tryMove,
    newGame,
    dismissWin,
  } = useGame2048();

  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const start = touchRef.current;
      touchRef.current = null;
      if (!start) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_MIN) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        tryMove(dx > 0 ? "right" : "left");
      } else {
        tryMove(dy > 0 ? "down" : "up");
      }
    },
    [tryMove],
  );

  return (
    <div className="game2048-shell min-h-[calc(100vh-4rem)] bg-background px-4 pb-16 pt-24 text-foreground md:pt-28">
      <PageMeta
        title="2048"
        description="Slide tiles on a 4×4 grid to combine powers of two — keyboard, buttons, or swipe."
        path="/2048"
      />
      <div className="mx-auto flex max-w-md flex-col gap-6">
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
            onClick={newGame}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            New game
          </Button>
        </header>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Grid3x3 className="h-8 w-8 text-primary" aria-hidden />
            <h1 className="font-serif text-3xl font-semibold tracking-tight">
              2048
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Merge tiles to reach {WIN_VALUE}. Arrows, WASD, buttons, or swipe.
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <div className="min-w-[5.5rem] rounded-md bg-muted px-3 py-2 text-center">
            <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
              Score
            </div>
            <div className="text-xl font-bold tabular-nums">{score}</div>
          </div>
          <div className="min-w-[5.5rem] rounded-md bg-muted px-3 py-2 text-center">
            <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
              Best
            </div>
            <div className="text-xl font-bold tabular-nums">{best}</div>
          </div>
        </div>

        <div
          className="game2048-board mx-auto w-full max-w-[min(100%,22rem)]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="application"
          aria-label="2048 board. Use arrow keys or swipe."
        >
          {board.map((row, r) =>
            row.map((value, c) => (
              <div key={`${r}-${c}`} className="game2048-cell">
                {value > 0 ? (
                  <div className={tileClassName(value)}>{value}</div>
                ) : null}
              </div>
            )),
          )}
        </div>

        <div className="game2048-pad" aria-label="Direction controls">
          <div className="game2048-pad-spacer" aria-hidden />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="h-12 w-full"
            onClick={() => tryMove("up")}
            aria-label="Move up"
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
          <div className="game2048-pad-spacer" aria-hidden />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="h-12 w-full"
            onClick={() => tryMove("left")}
            aria-label="Move left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="game2048-pad-spacer" aria-hidden />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="h-12 w-full"
            onClick={() => tryMove("right")}
            aria-label="Move right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <div className="game2048-pad-spacer" aria-hidden />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="h-12 w-full"
            onClick={() => tryMove("down")}
            aria-label="Move down"
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
          <div className="game2048-pad-spacer" aria-hidden />
        </div>
      </div>

      <Dialog open={won} onOpenChange={(o) => !o && dismissWin()}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>You made {WIN_VALUE}!</DialogTitle>
            <DialogDescription>
              Keep going for a higher tile, or start a new game.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="secondary" onClick={newGame}>
              New game
            </Button>
            <Button type="button" onClick={dismissWin}>
              Keep playing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {gameOver ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-[2px]"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="g2048-over-title"
          aria-describedby="g2048-over-desc"
        >
          <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-lg">
            <h2 id="g2048-over-title" className="text-lg font-semibold">
              Game over
            </h2>
            <p
              id="g2048-over-desc"
              className="mt-2 text-sm text-muted-foreground"
            >
              No moves left. Final score:{" "}
              <span className="font-semibold text-foreground">{score}</span>
            </p>
            <Button type="button" className="mt-6 w-full" onClick={newGame}>
              Try again
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

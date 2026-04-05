import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bomb, ChevronLeft, Flag, RotateCcw, Sparkles } from "lucide-react";
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
import { useMinesweeper } from "../hooks/useMinesweeper";
import { DIFFICULTIES, type Cell, type DifficultyId } from "../utils/minesweeper";

import "./index.css";

function cellAriaLabel(cell: Cell, lost: boolean): string {
  if (cell.state === "flagged") return "Flagged cell";
  if (cell.state === "hidden") return "Hidden cell";
  if (cell.isMine) return lost ? "Mine" : "Revealed mine";
  if (cell.adjacent > 0) return `${cell.adjacent} adjacent mines`;
  return "Empty cell";
}

function CellButton(props: {
  cell: Cell;
  status: "playing" | "won" | "lost";
  onReveal: () => void;
  onFlag: () => void;
  onChord: () => void;
  flagMode: boolean;
}) {
  const { cell, status, onReveal, onFlag, onChord, flagMode } = props;
  const longRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLong = () => {
    if (longRef.current) {
      clearTimeout(longRef.current);
      longRef.current = null;
    }
  };

  const playing = status === "playing";
  const revealed = cell.state === "revealed";
  const flagged = cell.state === "flagged";

  const disabled =
    !playing ||
    (revealed && cell.isMine) ||
    (revealed && !cell.isMine && cell.adjacent === 0);

  const className = [
    "ms-cell",
    revealed && "ms-cell--open",
    revealed && cell.isMine && "ms-cell--mine",
    flagged && !revealed && "ms-cell--flag",
  ]
    .filter(Boolean)
    .join(" ");

  const adjClass =
    revealed && !cell.isMine && cell.adjacent > 0
      ? `ms-adj-${cell.adjacent}`
      : "";

  const content = (() => {
    if (flagged && !revealed) return null;
    if (!revealed) return null;
    if (cell.isMine) {
      return <Bomb className="h-3.5 w-3.5 text-destructive" aria-hidden />;
    }
    if (cell.adjacent > 0) {
      return <span className={adjClass}>{cell.adjacent}</span>;
    }
    return null;
  })();

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      aria-label={cellAriaLabel(cell, status === "lost")}
      onClick={() => {
        if (!playing) return;
        if (flagMode) {
          onFlag();
          return;
        }
        if (revealed && cell.adjacent > 0) {
          onChord();
          return;
        }
        if (!revealed) onReveal();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        if (playing) onFlag();
      }}
      onAuxClick={(e) => {
        if (e.button === 1) {
          e.preventDefault();
          if (playing && revealed && cell.adjacent > 0) onChord();
        }
      }}
      onPointerDown={
        playing && !flagMode && !revealed
          ? () => {
              clearLong();
              longRef.current = setTimeout(() => {
                longRef.current = null;
                onFlag();
              }, 480);
            }
          : undefined
      }
      onPointerUp={clearLong}
      onPointerLeave={clearLong}
      onPointerCancel={clearLong}
    >
      {content}
    </button>
  );
}

export default function MinesweeperPage() {
  const {
    difficulty,
    setDifficulty,
    board,
    status,
    mineTotal,
    minesRemaining,
    newGame,
    reveal,
    flag,
    chord,
    rows,
    cols,
  } = useMinesweeper("beginner");

  const [flagMode, setFlagMode] = useState(false);

  const diffIds = Object.keys(DIFFICULTIES) as DifficultyId[];

  return (
    <div className="ms-root min-h-[calc(100vh-4rem)] bg-background px-4 pb-16 pt-24 text-foreground md:pt-28">
      <PageMeta
        title="Minesweeper"
        description="Classic minesweeper with beginner, intermediate, and expert grids — flags, chords, and a safe first click."
        path="/minesweeper"
      />
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
            <Link to="/games">
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Games
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-2">
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
          </div>
        </header>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Bomb className="h-8 w-8 text-primary" aria-hidden />
            <h1 className="font-serif text-3xl font-semibold tracking-tight">
              Minesweeper
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Left-click to reveal · right-click or long-press to flag · middle-click
            or click a number to chord (when flags match).
          </p>
        </div>

        <div className="ms-toolbar">
          <div className="flex rounded-md border border-border bg-muted/40 p-0.5">
            {diffIds.map((id) => (
              <Button
                key={id}
                type="button"
                variant={difficulty === id ? "secondary" : "ghost"}
                size="sm"
                className="rounded-sm px-3 text-xs sm:text-sm"
                onClick={() => setDifficulty(id)}
              >
                {DIFFICULTIES[id].label}
              </Button>
            ))}
          </div>
          <div
            className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-semibold"
            aria-live="polite"
          >
            <span className="text-muted-foreground">Mines</span>
            <span className="ms-mine-count">{minesRemaining}</span>
          </div>
          <Button
            type="button"
            variant={flagMode ? "secondary" : "outline"}
            size="sm"
            className="ms-flag-mode gap-1.5"
            data-active={flagMode}
            onClick={() => setFlagMode((f) => !f)}
            aria-pressed={flagMode}
          >
            <Flag className="h-3.5 w-3.5" aria-hidden />
            Flag mode
          </Button>
        </div>

        <div className="flex justify-center overflow-x-auto">
          <div
            className="ms-grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
            role="grid"
            aria-label={`Minefield ${rows} by ${cols}, ${mineTotal} mines`}
          >
            {board.map((row, r) =>
              row.map((cell, c) => (
                <CellButton
                  key={`${r}-${c}`}
                  cell={cell}
                  status={status}
                  onReveal={() => reveal(r, c)}
                  onFlag={() => flag(r, c)}
                  onChord={() => chord(r, c)}
                  flagMode={flagMode}
                />
              )),
            )}
          </div>
        </div>
      </div>

      <Dialog open={status === "won"} onOpenChange={(o) => !o && newGame()}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" aria-hidden />
              Cleared!
            </DialogTitle>
            <DialogDescription>
              You revealed every safe square on this difficulty.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={newGame}>
              Play again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={status === "lost"} onOpenChange={(o) => !o && newGame()}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Boom</DialogTitle>
            <DialogDescription>
              That was a mine. All mines are shown — try again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={newGame}>
              Try again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

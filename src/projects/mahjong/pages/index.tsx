import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Layers2, Lightbulb, RotateCcw, Shuffle } from "lucide-react";
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
import { cn } from "@/lib/utils";
import {
  createBoard,
  hintPair,
  reshuffleKinds,
  trySelect,
} from "../lib/game";
import { hasMatchingFreePair, isTileFree } from "../lib/rules";
import { TILE_STYLE } from "../lib/tiles";

const STEP_X = 42;
const STEP_Y = 54;
const TILE_W = 44;
const TILE_H = 58;
const Z_SHIFT_X = 3;
const Z_SHIFT_Y = 2;

export default function MahjongPage() {
  const [board, setBoard] = useState(() => createBoard());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hintIds, setHintIds] = useState<string[]>([]);
  const [winOpen, setWinOpen] = useState(false);

  const sortedTiles = useMemo(
    () =>
      [...board].sort((a, b) =>
        a.z !== b.z ? a.z - b.z : a.y !== b.y ? a.y - b.y : a.x - b.x,
      ),
    [board],
  );

  const boardSize = useMemo(() => {
    let maxR = 0;
    let maxB = 0;
    for (const t of board) {
      const left = t.x * STEP_X + t.z * Z_SHIFT_X;
      const top = t.y * STEP_Y + t.z * Z_SHIFT_Y;
      maxR = Math.max(maxR, left + TILE_W);
      maxB = Math.max(maxB, top + TILE_H);
    }
    return { w: Math.max(maxR + 8, 280), h: Math.max(maxB + 8, 260) };
  }, [board]);

  const stuck = board.length > 0 && !hasMatchingFreePair(board);

  const newGame = useCallback(() => {
    setBoard(createBoard());
    setSelectedId(null);
    setHintIds([]);
    setWinOpen(false);
  }, []);

  const onTileClick = useCallback(
    (id: string) => {
      setHintIds([]);
      const r = trySelect(board, selectedId, id);
      setBoard(r.board);
      setSelectedId(r.selectedId);
      if (r.board.length === 0) setWinOpen(true);
    },
    [board, selectedId],
  );

  const onShuffle = useCallback(() => {
    setBoard((b) => reshuffleKinds(b));
    setSelectedId(null);
    setHintIds([]);
  }, []);

  const onHint = useCallback(() => {
    const pair = hintPair(board);
    if (!pair) return;
    setHintIds(pair);
    window.setTimeout(() => setHintIds([]), 2200);
  }, [board]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background px-4 pb-16 pt-24 text-foreground md:pt-28">
      <PageMeta
        title="Mahjong Solitaire"
        description="Match open pairs of tiles in a stacked layout — classic Shanghai solitaire."
        path="/mahjong"
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
            onClick={newGame}
            className="gap-1"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            New deal
          </Button>
        </header>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Layers2 className="h-8 w-8 text-primary" aria-hidden />
            <h1 className="font-serif text-3xl font-semibold tracking-tight">
              Mahjong Solitaire
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Click two <strong className="font-medium text-foreground">open</strong> tiles with the
            same suit and rank. A tile is open if nothing sits on top of it and it is not blocked
            on <em>both</em> sides. Clear all 36 tiles to win.
          </p>
        </div>

        {stuck ? (
          <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-center text-sm text-amber-900 dark:text-amber-100">
            No open pairs left. Use <strong>Shuffle</strong> to redraw faces on the same layout.
          </p>
        ) : null}

        <div
          className="relative mx-auto rounded-xl border border-border bg-card p-3 shadow-inner"
          style={{
            width: boardSize.w,
            minHeight: boardSize.h,
          }}
        >
          {sortedTiles.map((t) => {
            const st = TILE_STYLE[t.kind];
            const free = isTileFree(t, board);
            const sel = t.id === selectedId;
            const hint = hintIds.includes(t.id);
            const left = t.x * STEP_X + t.z * Z_SHIFT_X;
            const top = t.y * STEP_Y + t.z * Z_SHIFT_Y;
            const zIndex = 10 + t.z * 20 + t.y * 3 + t.x;

            return (
              <button
                key={t.id}
                type="button"
                disabled={!free}
                onClick={() => onTileClick(t.id)}
                style={{
                  position: "absolute",
                  left,
                  top,
                  width: TILE_W,
                  height: TILE_H,
                  zIndex,
                }}
                aria-label={`${st.suit} ${st.label}${free ? "" : ", blocked"}`}
                aria-pressed={sel}
                className={cn(
                  "flex flex-col items-center justify-center rounded-md border-2 text-sm font-bold shadow-md transition-transform duration-150",
                  st.suitClass,
                  free
                    ? "cursor-pointer hover:brightness-110 active:scale-95"
                    : "cursor-not-allowed opacity-55",
                  sel && "ring-2 ring-primary ring-offset-2 ring-offset-card",
                  hint && "ring-2 ring-amber-400 ring-offset-2 ring-offset-card animate-pulse",
                )}
              >
                <span className="text-[10px] font-semibold uppercase opacity-70">
                  {st.suit.slice(0, 3)}
                </span>
                <span className="text-xl leading-none">{st.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onShuffle}
            disabled={board.length === 0}
            className="gap-1"
          >
            <Shuffle className="h-3.5 w-3.5" aria-hidden />
            Shuffle
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onHint}
            disabled={board.length === 0 || stuck}
            className="gap-1"
          >
            <Lightbulb className="h-3.5 w-3.5" aria-hidden />
            Hint
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {board.length} tiles left
        </p>
      </div>

      <Dialog open={winOpen} onOpenChange={setWinOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Board cleared</DialogTitle>
            <DialogDescription>
              Every pair matched — nice work.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={newGame}>
              New deal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

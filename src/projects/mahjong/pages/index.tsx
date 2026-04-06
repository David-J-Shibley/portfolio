import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Layers2,
  Lightbulb,
  RotateCcw,
  Shuffle,
  Undo2,
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
import { cn } from "@/lib/utils";
import {
  cloneBoard,
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
const TOTAL_TILES = 36;

function formatTime(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MahjongPage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [board, setBoard] = useState(() => createBoard());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hintIds, setHintIds] = useState<string[]>([]);
  const [winOpen, setWinOpen] = useState(false);
  const [undoStack, setUndoStack] = useState<ReturnType<typeof cloneBoard>[]>(
    [],
  );
  const [dealT0, setDealT0] = useState(() => Date.now());
  const [elapsedSec, setElapsedSec] = useState(0);
  const [finalTimeSec, setFinalTimeSec] = useState(0);
  const [flashInvalidId, setFlashInvalidId] = useState<string | null>(null);
  const [boardScale, setBoardScale] = useState(1);

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

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const cw = el.clientWidth - 8;
      if (cw <= 0 || boardSize.w <= 0) return;
      setBoardScale(Math.min(1, cw / boardSize.w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [boardSize.w]);

  useEffect(() => {
    if (board.length === 0) return;
    const tick = () =>
      setElapsedSec(Math.floor((Date.now() - dealT0) / 1000));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [dealT0, board.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const stuck = board.length > 0 && !hasMatchingFreePair(board);
  const pairsMatched = (TOTAL_TILES - board.length) / 2;

  const newGame = useCallback(() => {
    setBoard(createBoard());
    setSelectedId(null);
    setHintIds([]);
    setWinOpen(false);
    setUndoStack([]);
    setDealT0(Date.now());
    setElapsedSec(0);
    setFinalTimeSec(0);
    setFlashInvalidId(null);
  }, []);

  const onUndo = useCallback(() => {
    setUndoStack((stack) => {
      if (stack.length === 0) return stack;
      const prev = stack[stack.length - 1]!;
      setBoard(prev);
      setSelectedId(null);
      setHintIds([]);
      return stack.slice(0, -1);
    });
  }, []);

  const onTileClick = useCallback(
    (id: string) => {
      setHintIds([]);
      const r = trySelect(board, selectedId, id);
      if (r.invalid) {
        setFlashInvalidId(id);
        window.setTimeout(() => setFlashInvalidId(null), 450);
        return;
      }
      if (r.matched) {
        setUndoStack((u) => [...u, cloneBoard(board)].slice(-24));
      }
      setBoard(r.board);
      setSelectedId(r.selectedId);
      if (r.board.length === 0) {
        setFinalTimeSec(Math.floor((Date.now() - dealT0) / 1000));
        setWinOpen(true);
      }
    },
    [board, selectedId, dealT0],
  );

  const onShuffle = useCallback(() => {
    setBoard((b) => reshuffleKinds(b));
    setSelectedId(null);
    setHintIds([]);
    setUndoStack([]);
  }, []);

  const onHint = useCallback(() => {
    const pair = hintPair(board);
    if (!pair) return;
    setHintIds(pair);
    window.setTimeout(() => setHintIds([]), 2600);
  }, [board]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background px-4 pb-16 pt-24 text-foreground md:pt-28">
      <PageMeta
        title="Mahjong Solitaire"
        description="Match open pairs of tiles in a stacked layout — classic Shanghai solitaire."
        path="/mahjong"
      />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-5">
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
            Click two <strong className="font-medium text-foreground">open</strong>{" "}
            tiles with the same suit and rank (BAM / WAN / DOT). Open means nothing
            on top and not blocked on <em>both</em> sides.{" "}
            <span className="text-muted-foreground/80">Esc</span> clears selection.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm tabular-nums">
          <span>
            <span className="text-muted-foreground">Time </span>
            <span className="font-semibold text-foreground">
              {formatTime(
                board.length === 0 ? finalTimeSec : elapsedSec,
              )}
            </span>
          </span>
          <span className="text-border">|</span>
          <span>
            <span className="text-muted-foreground">Pairs </span>
            <span className="font-semibold text-foreground">{pairsMatched}</span>
            <span className="text-muted-foreground"> / {TOTAL_TILES / 2}</span>
          </span>
          <span className="text-border">|</span>
          <span>
            <span className="text-muted-foreground">Tiles </span>
            <span className="font-semibold text-foreground">{board.length}</span>
          </span>
        </div>

        {stuck ? (
          <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-center text-sm text-amber-900 dark:text-amber-100">
            No open pairs left. Use <strong>Shuffle</strong> to redraw faces on the
            same layout.
          </p>
        ) : null}

        <div ref={wrapRef} className="w-full max-w-full overflow-x-auto">
          <div
            className="mx-auto flex justify-center pb-1 pt-0.5"
            style={{
              minHeight: boardSize.h * boardScale + 16,
            }}
          >
            <div
              className="relative rounded-xl border border-border bg-gradient-to-b from-muted/80 to-card p-3 shadow-inner ring-1 ring-black/5 dark:ring-white/10"
              style={{
                width: boardSize.w * boardScale,
                height: boardSize.h * boardScale,
              }}
            >
              <div
                className="relative origin-top"
                style={{
                  width: boardSize.w,
                  height: boardSize.h,
                  transform: `scale(${boardScale})`,
                  transformOrigin: "top center",
                }}
              >
                {sortedTiles.map((t) => {
                  const st = TILE_STYLE[t.kind];
                  const free = isTileFree(t, board);
                  const sel = t.id === selectedId;
                  const hint = hintIds.includes(t.id);
                  const flash = t.id === flashInvalidId;
                  const left = t.x * STEP_X + t.z * Z_SHIFT_X;
                  const top = t.y * STEP_Y + t.z * Z_SHIFT_Y;
                  const zIndex = 10 + t.z * 20 + t.y * 3 + t.x;
                  const lift = -t.z * 0.75;

                  return (
                    <button
                      key={t.id}
                      type="button"
                      aria-disabled={!free}
                      tabIndex={free ? 0 : -1}
                      onClick={() => onTileClick(t.id)}
                      style={{
                        position: "absolute",
                        left,
                        top: top + lift,
                        width: TILE_W,
                        height: TILE_H,
                        zIndex,
                        boxShadow: free
                          ? `${t.z * 0.5}px ${2 + t.z * 1.5}px ${6 + t.z * 3}px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)`
                          : `${t.z * 0.25}px ${1 + t.z}px ${3 + t.z * 2}px rgba(0,0,0,0.25)`,
                      }}
                      aria-label={`${st.suit} ${st.label}${free ? "" : ", blocked"}`}
                      aria-pressed={sel}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-md border-2 bg-gradient-to-b font-bold transition-[transform,filter,ring] duration-150",
                        st.suitClass,
                        st.faceClass,
                        free
                          ? "cursor-pointer hover:brightness-110 hover:scale-[1.03] active:scale-[0.98]"
                          : "cursor-not-allowed opacity-[0.48] saturate-[0.65]",
                        sel &&
                          "z-[200] ring-2 ring-primary ring-offset-2 ring-offset-card scale-[1.04]",
                        hint &&
                          "z-[199] ring-2 ring-amber-400 ring-offset-2 ring-offset-card animate-pulse",
                        flash && "animate-shake",
                      )}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                        {st.abbrev}
                      </span>
                      <span className="text-[22px] leading-none tabular-nums drop-shadow-sm">
                        {st.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
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
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onUndo}
            disabled={undoStack.length === 0 || board.length === TOTAL_TILES}
            className="gap-1"
          >
            <Undo2 className="h-3.5 w-3.5" aria-hidden />
            Undo pair
          </Button>
        </div>
      </div>

      <Dialog open={winOpen} onOpenChange={setWinOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Board cleared</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2 text-left text-sm">
                <p>Every pair matched — nice work.</p>
                <ul className="list-inside list-disc text-muted-foreground">
                  <li>Time: {formatTime(finalTimeSec)}</li>
                  <li>Pairs: {TOTAL_TILES / 2}</li>
                </ul>
              </div>
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

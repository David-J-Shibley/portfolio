import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, UsersRound } from "lucide-react";
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
  discardTile,
  drawFromWall,
  initialState,
  SEAT_NAMES,
  type GameState,
} from "../lib/gameEngine";
import { tileLabel } from "../lib/tileSet";

function tileButtonClasses(tile: number): string {
  if (tile < 9)
    return "border-emerald-800/70 bg-gradient-to-b from-emerald-950/90 via-emerald-900/85 to-emerald-950/95 text-emerald-50";
  if (tile < 18)
    return "border-rose-800/70 bg-gradient-to-b from-rose-950/90 via-rose-900/85 to-rose-950/95 text-rose-50";
  if (tile < 27)
    return "border-sky-800/70 bg-gradient-to-b from-sky-950/90 via-sky-900/85 to-sky-950/95 text-sky-50";
  return "border-slate-700/80 bg-gradient-to-b from-slate-900/95 via-slate-800/90 to-slate-900/95 text-slate-100";
}

function TileFace({ tile }: { tile: number }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-[2.5rem] min-w-[2rem] items-center justify-center rounded-md border-2 border-b-[3px] px-1.5 text-[0.7rem] font-bold tabular-nums shadow-sm",
        tileButtonClasses(tile),
      )}
      aria-hidden
    >
      {tileLabel(tile)}
    </span>
  );
}

function SeatBlock({
  title,
  handCount,
  isTurn,
  accent,
  children,
}: {
  title: string;
  handCount: number;
  isTurn: boolean;
  accent?: "draw" | "discard";
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-3 shadow-sm transition-colors",
        isTurn
          ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
          : "border-border bg-card/80",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <span className="text-xs tabular-nums text-muted-foreground">
          {handCount} tiles
        </span>
      </div>
      {accent && (
        <p className="mt-1 text-xs font-medium text-primary">
          {accent === "draw" ? "Draw from wall" : "Discard one tile"}
        </p>
      )}
      {children ? (
        <div className="mt-3">{children}</div>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">
          Pass the device when it is this seat&apos;s turn.
        </p>
      )}
    </div>
  );
}

function resultMessage(state: GameState): string {
  const r = state.result;
  if (!r) return "";
  if (r.type === "tsumo")
    return `${SEAT_NAMES[r.winner]} wins by tsumo (self-draw).`;
  if (r.type === "ron")
    return `${SEAT_NAMES[r.winner]} wins by ron on ${SEAT_NAMES[r.discarder]}'s discard.`;
  return "Exhaustive draw — no winner.";
}

export default function MahjongMultiPage() {
  const [state, setState] = useState<GameState>(() => initialState());
  const [endOpen, setEndOpen] = useState(false);

  useEffect(() => {
    if (state.result) setEndOpen(true);
  }, [state.result]);

  const newGame = () => {
    setState(initialState());
    setEndOpen(false);
  };

  const seatOrder = [
    { seat: 3, label: SEAT_NAMES[3], grid: "order-1 md:col-span-3" },
    { seat: 2, label: SEAT_NAMES[2], grid: "order-2 md:col-span-1" },
    { seat: -1, label: "table", grid: "order-3 md:col-span-1" },
    { seat: 1, label: SEAT_NAMES[1], grid: "order-4 md:col-span-1" },
    { seat: 0, label: SEAT_NAMES[0], grid: "order-5 md:col-span-3" },
  ] as const;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background px-4 pb-16 pt-24 text-foreground md:pt-28">
      <PageMeta
        title="Mahjong (4-player)"
        description="Local four-player mahjong — draw, discard, tsumo and ron with a simplified winning hand."
        path="/mahjong-multi"
      />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
            <Link to="/games">
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Games
            </Link>
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={newGame}>
            New game
          </Button>
        </header>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <UsersRound className="h-8 w-8 text-primary" aria-hidden />
            <h1 className="font-serif text-3xl font-semibold tracking-tight">
              Mahjong
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Hot-seat for four: same device, pass when the turn changes. Standard
            shape win only (four melds + pair); no chi/pon/kan or scoring.
          </p>
        </div>

        <p
          className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-center text-sm"
          role="status"
        >
          {state.phase.type === "finished"
            ? "Hand over — see dialog or start a new game."
            : state.phase.type === "must_discard"
              ? `${SEAT_NAMES[state.phase.player]} must discard.`
              : `${SEAT_NAMES[state.phase.player]} draws next (${state.wall.length} left in wall).`}
        </p>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-stretch">
          {seatOrder.map((slot) => {
            if (slot.seat === -1) {
              return (
                <div
                  key="center"
                  className={cn(
                    "flex flex-col justify-center gap-3 rounded-2xl border border-border bg-muted/20 p-4",
                    slot.grid,
                  )}
                >
                  <div className="text-center">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Wall
                    </p>
                    <p className="text-2xl font-semibold tabular-nums">
                      {state.wall.length}
                    </p>
                  </div>
                  {state.lastDiscard && (
                    <div className="text-center">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Last discard
                      </p>
                      <div className="mt-2 flex justify-center">
                        <TileFace tile={state.lastDiscard.tile} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {SEAT_NAMES[state.lastDiscard.player]}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Discard pool
                    </p>
                    <div className="mt-2 flex max-h-24 flex-wrap justify-center gap-1 overflow-y-auto">
                      {state.discards.map((d, i) => (
                        <TileFace key={`${d.player}-${i}-${d.tile}`} tile={d.tile} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            const s = slot.seat;
            const count = state.hands[s]!.length;
            const isTurn =
              state.phase.type !== "finished" && state.phase.player === s;
            const showDiscard =
              state.phase.type === "must_discard" && state.phase.player === s;
            const showDraw =
              state.phase.type === "ready_to_draw" && state.phase.player === s;

            return (
              <div key={s} className={slot.grid}>
                <SeatBlock
                  title={slot.label}
                  handCount={count}
                  isTurn={!!isTurn}
                  accent={
                    showDiscard ? "discard" : showDraw ? "draw" : undefined
                  }
                >
                  {showDiscard && (
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {state.hands[s]!.map((tile, idx) => (
                        <button
                          key={`${tile}-${idx}`}
                          type="button"
                          className={cn(
                            "rounded-md border-2 border-transparent transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            "disabled:opacity-50",
                          )}
                          onClick={() =>
                            setState((prev) => discardTile(prev, idx))
                          }
                          aria-label={`Discard ${tileLabel(tile)}`}
                        >
                          <TileFace tile={tile} />
                        </button>
                      ))}
                    </div>
                  )}
                  {showDraw && (
                    <div className="flex justify-center">
                      <Button
                        type="button"
                        onClick={() =>
                          setState((prev) => drawFromWall(prev))
                        }
                      >
                        Draw tile
                      </Button>
                    </div>
                  )}
                </SeatBlock>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Dealer is East (starts with 14 tiles). Turn order: East → South →
          West → North.
        </p>
      </div>

      <Dialog open={endOpen} onOpenChange={setEndOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hand finished</DialogTitle>
            <DialogDescription>{resultMessage(state)}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="secondary" onClick={() => setEndOpen(false)}>
              Close
            </Button>
            <Button type="button" onClick={newGame}>
              New game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

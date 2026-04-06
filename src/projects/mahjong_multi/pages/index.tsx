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
  MahjongTileFace,
  mahjongTileAriaLabel,
} from "../components/MahjongTile";
import {
  discardTile,
  drawFromWall,
  initialState,
  SEAT_NAMES,
  type GameState,
} from "../lib/gameEngine";

const SEAT_COMPASS = ["E", "S", "W", "N"] as const;

function SeatBlock({
  title,
  compass,
  handCount,
  isTurn,
  accent,
  children,
}: {
  title: string;
  compass: string;
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
          ? "border-primary/45 bg-primary/[0.07] ring-2 ring-primary/15"
          : "border-border/80 bg-card/90 backdrop-blur-[2px]",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted/60 text-xs font-bold tabular-nums text-muted-foreground"
            aria-hidden
          >
            {compass}
          </span>
          <p className="truncate text-sm font-semibold text-foreground">
            {title}
          </p>
        </div>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {handCount} tiles
        </span>
      </div>
      {accent && (
        <p className="mt-2 text-center text-xs font-semibold text-primary sm:text-left">
          {accent === "draw" ? "Draw from the wall" : "Tap a tile to discard"}
        </p>
      )}
      {children ? (
        <div className="mt-3">{children}</div>
      ) : (
        <p className="mt-2 text-center text-xs text-muted-foreground sm:text-left">
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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-emerald-950/[0.06] via-background to-background px-4 pb-16 pt-24 text-foreground md:pt-28">
      <PageMeta
        title="Mahjong (4-player)"
        description="Local four-player mahjong — draw, discard, tsumo and ron with a simplified winning hand."
        path="/mahjong-multi"
      />
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
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
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Hot-seat for four on one device. Win with a standard hand (four
            melds + one pair). Tsumo and ron are supported; chi, pon, kan, and
            scoring are not.
          </p>
        </div>

        <p
          className="rounded-xl border border-border bg-card/70 px-4 py-3 text-center text-sm font-medium shadow-sm"
          role="status"
        >
          {state.phase.type === "finished"
            ? "Hand over — see the dialog or start a new game."
            : state.phase.type === "must_discard"
              ? `${SEAT_NAMES[state.phase.player]} must discard.`
              : `${SEAT_NAMES[state.phase.player]} draws next — ${state.wall.length} tiles left in the wall.`}
        </p>

        <div
          className={cn(
            "rounded-3xl border border-emerald-900/10 bg-emerald-950/[0.04] p-3 shadow-inner md:p-4",
            "dark:border-emerald-950/40 dark:bg-emerald-950/20",
          )}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-stretch">
            {seatOrder.map((slot) => {
              if (slot.seat === -1) {
                return (
                  <div
                    key="center"
                    className={cn(
                      "flex flex-col justify-center gap-4 rounded-2xl border border-border/70 bg-card/85 p-4 shadow-sm",
                      slot.grid,
                    )}
                  >
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-muted/50 px-3 py-3 text-center">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
                          Wall
                        </p>
                        <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-foreground">
                          {state.wall.length}
                        </p>
                      </div>
                      <div className="rounded-xl bg-muted/50 px-3 py-3 text-center">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
                          Discards
                        </p>
                        <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-foreground">
                          {state.discards.length}
                        </p>
                      </div>
                    </div>
                    {state.lastDiscard && (
                      <div className="rounded-xl border border-dashed border-border bg-background/60 px-3 py-3 text-center">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
                          Last discard
                        </p>
                        <div className="mt-2 flex justify-center">
                          <MahjongTileFace
                            tile={state.lastDiscard.tile}
                            size="lg"
                          />
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          From {SEAT_NAMES[state.lastDiscard.player]}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-center text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
                        Discard pool
                      </p>
                      {state.discards.length === 0 ? (
                        <p className="mt-3 text-center text-xs text-muted-foreground">
                          No discards yet.
                        </p>
                      ) : (
                        <div
                          className="mt-2 flex max-w-full gap-1.5 overflow-x-auto overflow-y-hidden pb-1 pt-0.5 [scrollbar-width:thin]"
                          style={{ WebkitOverflowScrolling: "touch" }}
                        >
                          {state.discards.map((d, i) => (
                            <MahjongTileFace
                              key={`${d.player}-${i}-${d.tile}`}
                              tile={d.tile}
                              size="sm"
                              className="shrink-0"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              const s = slot.seat;
              const count = state.hands[s]!.length;
              const isTurn =
                state.phase.type !== "finished" && state.phase.player === s;
              const showDiscard =
                state.phase.type === "must_discard" &&
                state.phase.player === s;
              const showDraw =
                state.phase.type === "ready_to_draw" &&
                state.phase.player === s;

              return (
                <div key={s} className={slot.grid}>
                  <SeatBlock
                    title={slot.label}
                    compass={SEAT_COMPASS[s]}
                    handCount={count}
                    isTurn={!!isTurn}
                    accent={
                      showDiscard ? "discard" : showDraw ? "draw" : undefined
                    }
                  >
                    {showDiscard && (
                      <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                        {state.hands[s]!.map((tile, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={cn(
                              "rounded-xl transition-transform hover:scale-[1.04] active:scale-[0.98]",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                              "disabled:opacity-50",
                            )}
                            onClick={() =>
                              setState((prev) => discardTile(prev, idx))
                            }
                            aria-label={`Discard ${mahjongTileAriaLabel(tile)}`}
                          >
                            <MahjongTileFace tile={tile} size="lg" />
                          </button>
                        ))}
                      </div>
                    )}
                    {showDraw && (
                      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        <Button
                          type="button"
                          size="lg"
                          className="min-w-[10rem] font-semibold"
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
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Dealer is East (14 tiles to start). Turn order: East → South → West →
          North. Compass badges match seat winds.
        </p>
      </div>

      <Dialog open={endOpen} onOpenChange={setEndOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hand finished</DialogTitle>
            <DialogDescription>{resultMessage(state)}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEndOpen(false)}
            >
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

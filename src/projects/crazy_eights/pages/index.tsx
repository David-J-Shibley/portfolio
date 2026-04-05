import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Club } from "lucide-react";
import { PageMeta } from "@/components/PageMeta";
import { PlayingCard } from "@/projects/card_games/components/PlayingCard";
import {
  suitSymbol,
  warRankValue,
  type Card,
  type Suit,
} from "@/projects/card_games/lib/cards";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  anyPlayable,
  applyPlayerPlay,
  canPlayCard,
  initialDeal,
  playerDrawOne,
  runCpuTurn,
  topDiscard,
  type EightsCore,
} from "../lib/engine";

const SUITS: Suit[] = ["H", "D", "C", "S"];

function sortHand(h: Card[]): Card[] {
  return [...h].sort((a, b) => {
    const s = a.suit.localeCompare(b.suit);
    if (s !== 0) return s;
    return warRankValue(a.rank) - warRankValue(b.rank);
  });
}

function freshGame(): EightsCore {
  const d = initialDeal();
  return {
    ...d,
    eightSuit: null,
    turn: "player",
    winner: null,
  };
}

export default function CrazyEightsPage() {
  const [game, setGame] = useState<EightsCore>(freshGame);
  const [pendingEight, setPendingEight] = useState<Card | null>(null);

  const top = topDiscard(game.discard);
  const playable = useMemo(() => {
    if (!top || game.turn !== "player" || game.winner) return () => false;
    return (c: Card) => canPlayCard(c, top, game.eightSuit);
  }, [top, game.turn, game.winner, game.eightSuit]);

  const canDraw =
    game.turn === "player" &&
    !game.winner &&
    top &&
    !anyPlayable(game.player, top, game.eightSuit);

  useEffect(() => {
    if (game.winner || game.turn !== "cpu") return;
    const id = window.setTimeout(() => {
      setGame((g) => {
        if (g.turn !== "cpu" || g.winner) return g;
        return runCpuTurn(g);
      });
    }, 550);
    return () => clearTimeout(id);
  }, [game.turn, game.winner]);

  const onCardClick = useCallback(
    (card: Card) => {
      if (game.turn !== "player" || game.winner || !top) return;
      if (!playable(card)) return;
      if (card.rank === "8") {
        setPendingEight(card);
        return;
      }
      setPendingEight(null);
      setGame((g) => applyPlayerPlay(g, card));
    },
    [game.turn, game.winner, top, playable],
  );

  const onSuitPick = (suit: Suit) => {
    if (!pendingEight || game.turn !== "player" || game.winner) return;
    const card = pendingEight;
    setPendingEight(null);
    setGame((g) => applyPlayerPlay(g, card, suit));
  };

  const draw = () => setGame((g) => playerDrawOne(g));
  const reset = () => {
    setGame(freshGame());
    setPendingEight(null);
  };

  const sorted = sortHand(game.player);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background px-4 pb-16 pt-24 text-foreground md:pt-28">
      <PageMeta
        title="Crazy Eights"
        description="Match rank or suit — 8s are wild. First to empty their hand wins."
        path="/crazy-eights"
      />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
            <Link to="/games">
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Games
            </Link>
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={reset}>
            New game
          </Button>
        </header>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Club className="h-8 w-8 text-primary" aria-hidden />
            <h1 className="font-serif text-3xl font-semibold tracking-tight">
              Crazy Eights
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Play a matching rank or suit on the pile. Eights are wild — pick the suit. CPU goes
            after you.
          </p>
        </div>

        <div
          className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-center text-sm"
          role="status"
        >
          {game.winner === "player" && "You win!"}
          {game.winner === "cpu" && "CPU wins."}
          {!game.winner && game.turn === "player" && !pendingEight && (
            <>
              Your turn.
              {game.eightSuit && top?.rank === "8" && (
                <span className="mt-1 block text-xs text-muted-foreground">
                  Match {suitSymbol(game.eightSuit)} or play an 8.
                </span>
              )}
            </>
          )}
          {!game.winner && game.turn === "player" && pendingEight && "Pick a suit for your 8."}
          {!game.winner && game.turn === "cpu" && "CPU is thinking…"}
        </div>

        <section className="flex flex-wrap items-end justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Stock ({game.stock.length})
            </span>
            <PlayingCard faceDown label="Draw pile" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Discard
            </span>
            {top ? <PlayingCard card={top} /> : <PlayingCard faceDown />}
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              CPU ({game.cpu.length})
            </span>
            <div className="flex gap-1">
              {game.cpu.slice(0, 5).map((c, i) => (
                <PlayingCard key={`${c.rank}${c.suit}-${i}`} faceDown label="CPU card" />
              ))}
              {game.cpu.length > 5 && (
                <span className="self-center text-xs text-muted-foreground">
                  +{game.cpu.length - 5}
                </span>
              )}
            </div>
          </div>
        </section>

        {pendingEight && (
          <div className="flex flex-wrap justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4">
            <p className="w-full text-center text-sm font-medium">Suit for your 8</p>
            {SUITS.map((s) => (
              <Button
                key={s}
                type="button"
                variant="outline"
                className="min-w-[3.5rem] text-lg"
                onClick={() => onSuitPick(s)}
              >
                {suitSymbol(s)}
              </Button>
            ))}
          </div>
        )}

        <section aria-label="Your hand" className="space-y-3">
          <h2 className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Your hand ({game.player.length})
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {sorted.map((card) => {
              const ok = playable(card);
              const isPending = pendingEight === card;
              return (
                <button
                  key={`${card.rank}${card.suit}-hand`}
                  type="button"
                  disabled={
                    game.turn !== "player" ||
                    !!game.winner ||
                    !ok ||
                    (!!pendingEight && pendingEight !== card)
                  }
                  onClick={() => onCardClick(card)}
                  className={cn(
                    "rounded-lg transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    ok && game.turn === "player" && !game.winner
                      ? "cursor-pointer hover:-translate-y-1"
                      : "cursor-not-allowed opacity-50",
                    isPending && "ring-2 ring-primary",
                  )}
                >
                  <PlayingCard card={card} />
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex flex-wrap justify-center gap-3 border-t border-border pt-4">
          <Button type="button" variant="secondary" disabled={!canDraw} onClick={draw}>
            Draw
          </Button>
        </div>
      </div>
    </div>
  );
}

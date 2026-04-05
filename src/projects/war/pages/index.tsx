import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Swords } from "lucide-react";
import { PageMeta } from "@/components/PageMeta";
import { PlayingCard } from "@/projects/card_games/components/PlayingCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WarBattles } from "../lib/warEngine";
import { playWarRound, splitDecks } from "../lib/warEngine";

type WarGame = {
  player: Card[];
  cpu: Card[];
  battles: WarBattles;
  roundWinner: "player" | "cpu" | null;
  over: boolean;
  note: string;
};

function freshGame(): WarGame {
  const [player, cpu] = splitDecks();
  return {
    player,
    cpu,
    battles: [],
    roundWinner: null,
    over: false,
    note: "Higher card wins both cards. Same rank → each adds three, then flip again.",
  };
}

export default function WarPage() {
  const [game, setGame] = useState<WarGame>(freshGame);

  const playRound = () => {
    setGame((g) => {
      if (g.over) return g;
      const r = playWarRound(g.player, g.cpu);
      if (r.kind === "gameover") {
        return {
          ...g,
          player: r.player,
          cpu: r.cpu,
          battles: [],
          roundWinner: null,
          over: true,
          note:
            r.winner === "player"
              ? "You captured the whole deck!"
              : "CPU captured the whole deck!",
        };
      }
      const warDepth = r.battles.length;
      return {
        ...g,
        player: r.player,
        cpu: r.cpu,
        battles: r.battles,
        roundWinner: r.winner,
        note:
          warDepth > 1
            ? `War — ${warDepth} clashes this round. ${r.winner === "player" ? "You" : "CPU"} took the pile.`
            : r.winner === "player"
              ? "You take both cards."
              : "CPU takes both cards.",
      };
    });
  };

  const reset = () => setGame(freshGame());

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background px-4 pb-16 pt-24 text-foreground md:pt-28">
      <PageMeta
        title="War"
        description="Classic War — flip cards, win ties with a three-card war."
        path="/war"
      />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
            <Link to="/games">
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Games
            </Link>
          </Button>
        </header>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Swords className="h-8 w-8 text-primary" aria-hidden />
            <h1 className="font-serif text-3xl font-semibold tracking-tight">War</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Ace is high. Ties: each side puts three cards down, then flips again until someone wins the pile.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-center text-sm">
          <div>
            <p className="text-muted-foreground">Your deck</p>
            <p className="text-2xl font-semibold tabular-nums">{game.player.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">CPU deck</p>
            <p className="text-2xl font-semibold tabular-nums">{game.cpu.length}</p>
          </div>
        </div>

        <p
          className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-center text-sm"
          role="status"
        >
          {game.note}
        </p>

        {game.battles.length > 0 && (
          <section aria-label="Last round cards" className="space-y-4">
            <h2 className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
              This round
            </h2>
            <div className="flex flex-col gap-6">
              {game.battles.map((b, i) => (
                <div
                  key={`${b.player.rank}${b.player.suit}-${b.cpu.rank}${b.cpu.suit}-${i}`}
                  className="flex flex-wrap items-end justify-center gap-4"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground">You</span>
                    <PlayingCard card={b.player} />
                  </div>
                  <span className="self-center text-muted-foreground">vs</span>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground">CPU</span>
                    <PlayingCard card={b.cpu} />
                  </div>
                </div>
              ))}
            </div>
            {game.roundWinner && (
              <p
                className={cn(
                  "text-center text-sm font-medium",
                  game.roundWinner === "player" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400",
                )}
              >
                {game.roundWinner === "player" ? "You won the pile." : "CPU won the pile."}
              </p>
            )}
          </section>
        )}

        <div className="flex flex-wrap justify-center gap-3 border-t border-border pt-6">
          <Button type="button" size="lg" disabled={game.over} onClick={playRound}>
            {game.battles.length === 0 && !game.over ? "Flip cards" : "Next round"}
          </Button>
          <Button type="button" size="lg" variant="secondary" onClick={reset}>
            New game
          </Button>
        </div>
      </div>
    </div>
  );
}

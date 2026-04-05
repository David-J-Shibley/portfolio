import { Link } from "react-router-dom";
import { ChevronLeft, Diamond } from "lucide-react";
import { PageMeta } from "@/components/PageMeta";
import { PlayingCard } from "@/projects/card_games/components/PlayingCard";
import { Button } from "@/components/ui/button";
import { BB, SB, useHoldem } from "../hooks/useHoldem";

export default function HoldemPage() {
  const h = useHoldem();
  const { state } = h;

  const playing = state.status === "playing";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background px-4 pb-16 pt-24 text-foreground md:pt-28">
      <PageMeta
        title="Texas Hold'em"
        description="Heads-up no-limit Hold'em vs CPU — blinds, streets, and showdown."
        path="/holdem"
      />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
            <Link to="/games">
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Games
            </Link>
          </Button>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border px-2 py-1">
              Blinds {SB}/{BB}
            </span>
            {playing && (
              <span className="rounded-full border border-border px-2 py-1">
                Pot: <strong className="text-foreground">{h.pot}</strong>
              </span>
            )}
          </div>
        </header>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Diamond className="h-8 w-8 text-primary" aria-hidden />
            <h1 className="font-serif text-3xl font-semibold tracking-tight">
              Texas Hold&apos;em
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Heads-up vs CPU. You and the CPU post blinds; button alternates each hand.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-center text-sm">
          <div>
            <p className="text-muted-foreground">Your stack</p>
            <p className="text-xl font-semibold tabular-nums">{state.heroStack}</p>
          </div>
          <div>
            <p className="text-muted-foreground">CPU stack</p>
            <p className="text-xl font-semibold tabular-nums">{state.cpuStack}</p>
          </div>
          {playing && (
            <div>
              <p className="text-muted-foreground">Street</p>
              <p className="text-xl font-semibold capitalize">{state.street}</p>
            </div>
          )}
        </div>

        <p
          className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-center text-sm"
          role="status"
        >
          {state.message}
        </p>

        {playing && (
          <>
            <section aria-label="Community cards" className="space-y-2">
              <h2 className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Board
              </h2>
              <div className="flex min-h-[7rem] flex-wrap justify-center gap-2">
                {state.board.map((c, i) => (
                  <PlayingCard key={`${c.rank}${c.suit}-${i}`} card={c} />
                ))}
                {state.board.length === 0 && (
                  <p className="self-center text-sm text-muted-foreground">No flop yet</p>
                )}
              </div>
            </section>

            <section aria-label="Your hole cards" className="space-y-2">
              <h2 className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Your cards
              </h2>
              <div className="flex justify-center gap-2">
                {state.heroHole.map((c, i) => (
                  <PlayingCard key={`h-${i}`} card={c} />
                ))}
              </div>
            </section>
          </>
        )}

        <div className="flex flex-col items-center gap-3 border-t border-border pt-6">
          {state.status === "idle" && (
            <Button type="button" size="lg" onClick={h.deal}>
              Deal hand
            </Button>
          )}

          {playing && (
            <div className="flex w-full max-w-md flex-col gap-2">
              <p className="text-center text-xs text-muted-foreground">
                {h.isHeroTurn
                  ? h.heroToCall > 0
                    ? `To call: ${h.heroToCall} chips`
                    : "Check or raise"
                  : "CPU is thinking…"}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  disabled={!h.isHeroTurn}
                  onClick={h.heroFold}
                >
                  Fold
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={!h.canCheck}
                  onClick={h.heroCheck}
                >
                  Check
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={!h.canCall}
                  onClick={h.heroCall}
                >
                  Call {h.heroToCall > 0 ? `(${h.heroToCall})` : ""}
                </Button>
                <Button
                  type="button"
                  variant="default"
                  disabled={!h.canRaise}
                  onClick={h.heroRaise}
                >
                  Raise to {h.minRaiseTotal}
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Min raise is the big blind or the last raise size. No side pots — keep enough chips to
          cover the blinds.
        </p>
      </div>
    </div>
  );
}

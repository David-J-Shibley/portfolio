import { Link } from "react-router-dom";
import { ChevronLeft, Minus, Plus, Spade } from "lucide-react";
import { PageMeta } from "@/components/PageMeta";
import { PlayingCard } from "@/projects/card_games/components/PlayingCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBlackjack } from "../hooks/useBlackjack";

export default function BlackjackPage() {
  const bj = useBlackjack();
  const canAct = bj.phase === "play";
  const canDeal = bj.phase === "pick" || bj.phase === "done";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background px-4 pb-16 pt-24 text-foreground md:pt-28">
      <PageMeta
        title="Blackjack"
        description="Play 21 against the house — double down, dealer stands on 17."
        path="/blackjack"
      />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
            <Link to="/games">
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Games
            </Link>
          </Button>
          <div className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold tabular-nums">
            Chips: {bj.bankroll}
          </div>
        </header>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Spade className="h-8 w-8 text-primary" aria-hidden />
            <h1 className="font-serif text-3xl font-semibold tracking-tight">
              Blackjack
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Dealer stands on 17. Blackjack pays 3:2. One deck, shuffled each hand.
          </p>
        </div>

        <p
          className={cn(
            "rounded-xl border border-border bg-muted/40 px-4 py-3 text-center text-sm",
            bj.phase === "done" && "font-medium text-foreground",
          )}
          role="status"
        >
          {bj.status}
        </p>

        <section aria-label="Dealer hand" className="space-y-2">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Dealer {bj.hideHole ? `(showing ${bj.dealerVisibleTotal})` : `(${bj.dealerVisibleTotal})`}
          </h2>
          <div className="flex min-h-[7rem] flex-wrap items-end justify-center gap-2 md:min-h-[8rem]">
            {bj.dealer.map((c, i) => (
              <PlayingCard
                key={`${c.rank}${c.suit}-${i}`}
                card={c}
                faceDown={bj.hideHole && i === 1}
                label={
                  bj.hideHole && i === 1
                    ? "Dealer hole card"
                    : `Dealer ${c.rank} ${c.suit}`
                }
              />
            ))}
          </div>
        </section>

        <section aria-label="Your hand" className="space-y-2">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            You ({bj.handTotal}
            {bj.handTotal <= 21 ? "" : " — bust"})
          </h2>
          <div className="flex min-h-[7rem] flex-wrap items-end justify-center gap-2 md:min-h-[8rem]">
            {bj.player.map((c, i) => (
              <PlayingCard
                key={`${c.rank}${c.suit}-${i}`}
                card={c}
                label={`Your ${c.rank} ${c.suit}`}
              />
            ))}
          </div>
        </section>

        <div className="flex flex-col items-center gap-4 border-t border-border pt-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm text-muted-foreground">Bet</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0"
                disabled={!canDeal}
                onClick={() => bj.adjustBet(-5)}
                aria-label="Decrease bet"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[3rem] text-center text-lg font-semibold tabular-nums">
                {bj.betUnit}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0"
                disabled={!canDeal}
                onClick={() => bj.adjustBet(5)}
                aria-label="Increase bet"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {canDeal && (
              <Button type="button" size="lg" onClick={bj.deal}>
                Deal
              </Button>
            )}
            {bj.phase === "done" && (
              <Button type="button" size="lg" variant="secondary" onClick={bj.newHand}>
                New hand
              </Button>
            )}
            {canAct && (
              <>
                <Button type="button" variant="secondary" onClick={bj.hit}>
                  Hit
                </Button>
                <Button type="button" variant="secondary" onClick={bj.stand}>
                  Stand
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={!bj.canDouble}
                  onClick={bj.double}
                >
                  Double
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

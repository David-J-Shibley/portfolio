import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp, ChevronLeft, TrendingUp } from "lucide-react";
import { PageMeta } from "@/components/PageMeta";
import { PlayingCard } from "@/projects/card_games/components/PlayingCard";
import { createDeck, shuffle, type Card } from "@/projects/card_games/lib/cards";
import { Button } from "@/components/ui/button";
import { resolveGuess, type HiLoGuess } from "../utils/hilo";

const LIVES_START = 3;

function freshRound(): { stock: Card[]; current: Card | null } {
  const d = shuffle(createDeck());
  const current = d.pop() ?? null;
  return { stock: d, current };
}

export default function HighLowPage() {
  const [{ stock, current }, setRound] = useState(freshRound);
  const [lives, setLives] = useState(LIVES_START);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [lastGuess, setLastGuess] = useState<HiLoGuess | null>(null);
  const [revealed, setRevealed] = useState<Card | null>(null);
  const [message, setMessage] = useState("Is the next card higher or lower? Ace is high.");
  const [gameOver, setGameOver] = useState(false);
  const [busy, setBusy] = useState(false);

  const canGuess =
    !gameOver && !busy && current !== null && stock.length > 0 && revealed === null;

  const applyRound = useCallback(
    (guess: HiLoGuess) => {
      if (!current || stock.length === 0 || busy || gameOver) return;
      const livesBefore = lives;
      const next = stock[stock.length - 1]!;
      const outcome = resolveGuess(current, next, guess);
      const newStock = stock.slice(0, -1);
      const livesAfter =
        outcome === "wrong" ? livesBefore - 1 : livesBefore;
      const willDie = outcome === "wrong" && livesAfter <= 0;

      setBusy(true);
      setLastGuess(guess);
      setRevealed(next);

      window.setTimeout(() => {
        if (outcome === "correct") {
          setStreak((s) => {
            const n = s + 1;
            setBest((b) => Math.max(b, n));
            return n;
          });
          setMessage("Right! Keep going.");
        } else if (outcome === "push") {
          setMessage("Same rank — push. Streak unchanged.");
        } else {
          setLives(livesAfter);
          if (willDie) {
            setGameOver(true);
            setMessage("Out of lives. Nice run!");
          } else {
            setMessage(`Wrong — ${livesAfter} ${livesAfter === 1 ? "life" : "lives"} left.`);
          }
          setStreak(0);
        }

        if (!willDie && newStock.length === 0) {
          const full = shuffle(createDeck());
          const nc = full.pop() ?? null;
          setRound({ stock: full, current: nc });
          setMessage((m) =>
            m.startsWith("Out of lives") ? m : "New shuffled deck — streak stays.",
          );
        } else {
          setRound({ stock: newStock, current: next });
        }

        setRevealed(null);
        setLastGuess(null);
        setBusy(false);
      }, 650);
    },
    [current, stock, busy, gameOver, lives],
  );

  const newGame = () => {
    setRound(freshRound());
    setLives(LIVES_START);
    setStreak(0);
    setLastGuess(null);
    setRevealed(null);
    setMessage("Is the next card higher or lower? Ace is high.");
    setGameOver(false);
    setBusy(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background px-4 pb-16 pt-24 text-foreground md:pt-28">
      <PageMeta
        title="Higher or Lower"
        description="Guess if the next card beats the current one — ace is high, ties push."
        path="/high-low"
      />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
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
            <TrendingUp className="h-8 w-8 text-primary" aria-hidden />
            <h1 className="font-serif text-3xl font-semibold tracking-tight">
              Higher or Lower
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Next card vs the one showing. Wrong guess costs a life. Same rank is a free push.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-center text-sm">
          <div>
            <p className="text-muted-foreground">Lives</p>
            <p className="text-2xl font-semibold tabular-nums">{lives}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Streak</p>
            <p className="text-2xl font-semibold tabular-nums">{streak}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Best streak</p>
            <p className="text-2xl font-semibold tabular-nums">{best}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Left in deck</p>
            <p className="text-2xl font-semibold tabular-nums">{stock.length}</p>
          </div>
        </div>

        <p
          className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-center text-sm"
          role="status"
        >
          {message}
        </p>

        <div className="flex flex-wrap items-end justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Current
            </span>
            {current ? (
              <PlayingCard card={current} />
            ) : (
              <PlayingCard faceDown label="No card" />
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Next
            </span>
            {revealed ? (
              <PlayingCard card={revealed} />
            ) : (
              <PlayingCard faceDown label="Next card face down" />
            )}
          </div>
        </div>

        {lastGuess && revealed && (
          <p className="text-center text-xs text-muted-foreground">
            You chose {lastGuess === "higher" ? "higher" : "lower"}…
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <Button
            type="button"
            size="lg"
            variant="secondary"
            disabled={!canGuess}
            className="gap-2"
            onClick={() => applyRound("higher")}
          >
            <ArrowUp className="h-4 w-4" aria-hidden />
            Higher
          </Button>
          <Button
            type="button"
            size="lg"
            variant="secondary"
            disabled={!canGuess}
            className="gap-2"
            onClick={() => applyRound("lower")}
          >
            <ArrowDown className="h-4 w-4" aria-hidden />
            Lower
          </Button>
        </div>

        {gameOver && (
          <Button type="button" size="lg" className="mx-auto" onClick={newGame}>
            Play again
          </Button>
        )}
      </div>
    </div>
  );
}

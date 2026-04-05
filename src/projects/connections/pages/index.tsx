import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Link2, RotateCcw, Shuffle } from "lucide-react";
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
  MAX_MISTAKES,
  difficultyBarClass,
  evaluateSelection,
  filterOutGroup,
  makePlacedWords,
  shuffledRemaining,
} from "../lib/game";
import { CONNECTION_PUZZLES } from "../lib/puzzles";
import type { PlacedWord, SolvedStrip } from "../lib/types";

type PlayStatus = "playing" | "won" | "lost";

export default function ConnectionsPage() {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const puzzle = CONNECTION_PUZZLES[puzzleIdx] ?? CONNECTION_PUZZLES[0]!;

  const [remaining, setRemaining] = useState<PlacedWord[]>(() =>
    shuffledRemaining(makePlacedWords(CONNECTION_PUZZLES[0]!)),
  );
  const [solved, setSolved] = useState<SolvedStrip[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(MAX_MISTAKES);
  const [status, setStatus] = useState<PlayStatus>("playing");
  const [hint, setHint] = useState<string | null>(null);
  const [winOpen, setWinOpen] = useState(false);
  const [loseOpen, setLoseOpen] = useState(false);

  const startPuzzle = useCallback((idx: number) => {
    const p = CONNECTION_PUZZLES[idx] ?? CONNECTION_PUZZLES[0]!;
    setPuzzleIdx(idx);
    setRemaining(shuffledRemaining(makePlacedWords(p)));
    setSolved([]);
    setSelected(new Set());
    setMistakes(MAX_MISTAKES);
    setStatus("playing");
    setHint(null);
    setWinOpen(false);
    setLoseOpen(false);
  }, []);

  const toggleWord = useCallback((id: string) => {
    if (status !== "playing") return;
    setHint(null);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 4) next.add(id);
      return next;
    });
  }, [status]);

  const clearSelection = useCallback(() => {
    setSelected(new Set());
    setHint(null);
  }, []);

  const shuffleBoard = useCallback(() => {
    if (status !== "playing") return;
    setRemaining((r) => shuffledRemaining(r));
    setHint(null);
  }, [status]);

  const submit = useCallback(() => {
    if (status !== "playing" || selected.size !== 4) return;
    const ids = [...selected];
    const result = evaluateSelection(puzzle, remaining, ids);
    if (result.kind === "need_four") return;

    if (result.kind === "solved") {
      setSolved((s) => {
        const next = [...s, result.strip];
        if (next.length === 4) {
          setStatus("won");
          setWinOpen(true);
        }
        return next;
      });
      setRemaining(filterOutGroup(remaining, result.strip.groupIndex));
      setSelected(new Set());
      setHint(null);
      return;
    }

    setMistakes((m) => {
      const next = m - 1;
      if (next <= 0) {
        setStatus("lost");
        setLoseOpen(true);
      }
      return next;
    });
    setSelected(new Set());
    setHint(
      result.oneAway
        ? "One away!"
        : "Not quite — try another combination.",
    );
  }, [puzzle, remaining, selected, status]);

  const canSubmit = selected.size === 4 && status === "playing";

  const puzzleOptions = useMemo(
    () =>
      CONNECTION_PUZZLES.map((p, i) => (
        <option key={p.id} value={i}>
          {p.name}
        </option>
      )),
    [],
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background px-4 pb-16 pt-24 text-foreground md:pt-28">
      <PageMeta
        title="Connections"
        description="Group sixteen words into four categories of four — inspired by the New York Times puzzle."
        path="/connections"
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
            onClick={() => startPuzzle(puzzleIdx)}
            className="gap-1"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Reset
          </Button>
        </header>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Link2 className="h-8 w-8 text-primary" aria-hidden />
            <h1 className="font-serif text-3xl font-semibold tracking-tight">
              Connections
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Find four groups of four words that share a theme. Four mistakes
            allowed. Inspired by the{" "}
            <a
              href="https://www.nytimes.com/games/connections"
              className="underline underline-offset-2 hover:text-foreground"
              target="_blank"
              rel="noreferrer"
            >
              NYT game
            </a>
            .
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="whitespace-nowrap">Puzzle</span>
            <select
              className="w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground sm:max-w-xs"
              value={puzzleIdx}
              disabled={status === "playing" && (solved.length > 0 || mistakes < MAX_MISTAKES)}
              onChange={(e) => startPuzzle(Number(e.target.value))}
            >
              {puzzleOptions}
            </select>
          </label>
          <div
            className="flex items-center gap-2"
            role="status"
            aria-label={`Mistakes remaining: ${mistakes}`}
          >
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Mistakes
            </span>
            <div className="flex gap-1.5">
              {Array.from({ length: MAX_MISTAKES }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-2.5 w-9 rounded-full transition-colors",
                    i < mistakes ? "bg-primary" : "bg-muted-foreground/25",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {solved.length > 0 ? (
          <ul className="flex flex-col gap-2" aria-label="Solved groups">
            {solved.map((s) => (
              <li
                key={`${s.groupIndex}-${s.title}`}
                className={cn(
                  "rounded-lg px-4 py-3 shadow-sm text-zinc-950 dark:text-zinc-50",
                  difficultyBarClass(s.difficulty),
                )}
              >
                <p className="text-sm font-bold">{s.title}</p>
                <p className="mt-1 text-xs font-medium opacity-90 md:text-sm">
                  {s.words.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        <div
          className="grid grid-cols-4 gap-2"
          role="group"
          aria-label="Word grid"
        >
          {remaining.map((w) => {
            const isSel = selected.has(w.id);
            return (
              <button
                key={w.id}
                type="button"
                disabled={status !== "playing"}
                onClick={() => toggleWord(w.id)}
                aria-pressed={isSel}
                className={cn(
                  "min-h-[52px] rounded-lg border-2 px-1 py-2 text-center text-[0.65rem] font-bold uppercase leading-tight transition-colors sm:min-h-[56px] sm:text-xs md:text-sm",
                  isSel
                    ? "border-primary bg-primary/15 text-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted/60",
                  status !== "playing" && "opacity-80",
                )}
              >
                {w.word}
              </button>
            );
          })}
        </div>

        {hint ? (
          <p className="text-center text-sm font-medium text-amber-600 dark:text-amber-400">
            {hint}
          </p>
        ) : null}

        <div className="flex flex-wrap justify-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={shuffleBoard}
            disabled={status !== "playing"}
            className="gap-1"
          >
            <Shuffle className="h-3.5 w-3.5" aria-hidden />
            Shuffle
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={clearSelection}
            disabled={status !== "playing" || selected.size === 0}
          >
            Deselect all
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={submit}
            disabled={!canSubmit}
          >
            Submit
          </Button>
        </div>
      </div>

      <Dialog open={winOpen} onOpenChange={setWinOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Perfect grouping</DialogTitle>
            <DialogDescription>
              You found every category on “{puzzle.name}”.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setWinOpen(false);
                const next = (puzzleIdx + 1) % CONNECTION_PUZZLES.length;
                startPuzzle(next);
              }}
            >
              Next puzzle
            </Button>
            <Button
              type="button"
              onClick={() => {
                setWinOpen(false);
                startPuzzle(puzzleIdx);
              }}
            >
              Play again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={loseOpen} onOpenChange={setLoseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Out of guesses</DialogTitle>
            <DialogDescription>
              The board still had hidden links. Reset to try again or switch
              puzzles from the menu.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                setLoseOpen(false);
                startPuzzle(puzzleIdx);
              }}
            >
              Try again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

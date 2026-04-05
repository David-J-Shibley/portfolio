import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, ChevronLeft, Share2 } from "lucide-react";
import { PageMeta } from "@/components/PageMeta";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WORDLE_STATS } from "../data/loadWords";
import { useDailyWordle, type GameStatus } from "../hooks/useDailyWordle";
import type { LetterResult } from "../utils/wordleLogic";

import "./index.css";

const KEYBOARD_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"] as const;

function tileClasses(
  result: LetterResult | undefined,
  rowActive: boolean,
  hasLetter: boolean,
): string {
  const base =
    "wordle-tile flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center border-2 text-xl font-bold uppercase sm:text-2xl transition-colors duration-150";
  if (result) {
    if (result === "correct") {
      return `${base} wordle-tile--correct`;
    }
    if (result === "present") {
      return `${base} wordle-tile--present`;
    }
    return `${base} wordle-tile--absent`;
  }
  if (hasLetter) {
    return rowActive
      ? `${base} border-foreground/70 bg-transparent text-foreground`
      : `${base} border-muted-foreground/35 bg-transparent text-foreground`;
  }
  return `${base} border-muted-foreground/25 bg-transparent text-transparent`;
}

function GameRow(props: {
  rowIndex: number;
  guess: string | undefined;
  result: LetterResult[] | undefined;
  draft: string;
  activeRow: number;
  status: GameStatus;
  shake: boolean;
}) {
  const { rowIndex, guess, result, draft, activeRow, status, shake } = props;
  const isPast = guess !== undefined;
  const isCurrent =
    !isPast && rowIndex === activeRow && status === "playing";
  const letters = isPast
    ? guess.padEnd(5, " ")
    : isCurrent
      ? draft.padEnd(5, " ")
      : "     ";

  return (
    <div
      className={`flex gap-1.5 sm:gap-2 ${shake ? "wordle-shake" : ""}`}
      role="row"
      aria-label={isPast ? `Guess ${rowIndex + 1}: ${guess}` : undefined}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const ch = letters[i]?.trim() ? letters[i] : "";
        const r = result?.[i];
        const hasLetter = ch.length > 0;
        return (
          <div
            key={i}
            className={`${tileClasses(r, isCurrent, hasLetter)} ${hasLetter && isCurrent ? "wordle-tile-pop" : ""}`}
          >
            {ch || "\u00a0"}
          </div>
        );
      })}
    </div>
  );
}

export default function DailyWordlePage() {
  const {
    todayKey,
    solution,
    guesses,
    results,
    status,
    current,
    shakeRow,
    message,
    stats,
    keyStates,
    submitRow,
    addLetter,
    backspace,
    shareText,
    copyShare,
    rows,
  } = useDailyWordle();

  const [statsOpen, setStatsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeRow = guesses.length;
  const showEnd = status !== "playing";

  const hasSubmittedGuess = guesses.length > 0;
  const draftLetters = useMemo(() => {
    const s = new Set<string>();
    for (const c of current.toLowerCase()) {
      if (/[a-z]/.test(c)) s.add(c);
    }
    return s;
  }, [current]);

  const handleShare = useCallback(async () => {
    const ok = await copyShare();
    setCopied(ok);
    setTimeout(() => setCopied(false), 2000);
  }, [copyShare]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background px-4 pb-16 pt-24 text-foreground md:pt-28">
      <PageMeta
        title="Daily Wordle"
        description="One five-letter word per calendar day — same answer for everyone, classic Wordle feedback."
        path="/wordle"
      />
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
            <Link to="/games">
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Games
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Dialog open={statsOpen} onOpenChange={setStatsOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Statistics"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Statistics</DialogTitle>
                </DialogHeader>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Played</dt>
                    <dd className="text-2xl font-semibold tabular-nums">
                      {stats.gamesPlayed}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Win %</dt>
                    <dd className="text-2xl font-semibold tabular-nums">
                      {stats.gamesPlayed === 0
                        ? "—"
                        : Math.round(
                            (100 * stats.gamesWon) / stats.gamesPlayed,
                          )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Streak</dt>
                    <dd className="text-2xl font-semibold tabular-nums">
                      {stats.currentStreak}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Max streak</dt>
                    <dd className="text-2xl font-semibold tabular-nums">
                      {stats.maxStreak}
                    </dd>
                  </div>
                </dl>
                <p className="text-xs text-muted-foreground">
                  Progress is stored locally in your browser.
                </p>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="text-center">
          <h1 className="font-serif text-3xl font-semibold tracking-tight">
            Daily Wordle
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{todayKey}</p>
        </div>

        {message ? (
          <p
            className="text-center text-sm font-medium text-amber-600 dark:text-amber-400"
            role="status"
          >
            {message}
          </p>
        ) : null}

        <div
          className="flex flex-col gap-1.5 sm:gap-2"
          role="grid"
          aria-label="Wordle board"
          aria-rowcount={rows}
        >
          {Array.from({ length: rows }, (_, i) => (
            <GameRow
              key={i}
              rowIndex={i}
              guess={guesses[i]}
              result={results[i]}
              draft={current}
              activeRow={activeRow}
              status={status}
              shake={shakeRow === i}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2" aria-label="On-screen keyboard">
          {KEYBOARD_ROWS.map((row, ri) => (
            <div
              key={row}
              className={`flex justify-center gap-1 ${ri === 1 ? "px-4 sm:px-8" : ""}`}
            >
              {ri === 2 ? (
                <button
                  type="button"
                  className="wordle-key wordle-key--wide"
                  onClick={() => submitRow()}
                  disabled={status !== "playing"}
                >
                  Enter
                </button>
              ) : null}
              {Array.from(row, (ch) => {
                const st = keyStates[ch];
                const inDraft = draftLetters.has(ch);
                const untried = !st && hasSubmittedGuess;
                return (
                  <button
                    key={ch}
                    type="button"
                    className={cn(
                      "wordle-key min-w-[2rem] sm:min-w-[2.25rem]",
                      st === "correct" && "wordle-key--correct",
                      st === "present" && "wordle-key--present",
                      st === "absent" && "wordle-key--absent",
                      untried && "wordle-key--untried",
                      inDraft && "wordle-key--draft",
                    )}
                    aria-label={
                      inDraft
                        ? `${ch.toUpperCase()}, in current guess`
                        : untried
                          ? `${ch.toUpperCase()}, not used yet`
                          : undefined
                    }
                    onClick={() => addLetter(ch)}
                    disabled={status !== "playing"}
                  >
                    {ch}
                  </button>
                );
              })}
              {ri === 2 ? (
                <button
                  type="button"
                  className="wordle-key wordle-key--wide"
                  onClick={() => backspace()}
                  disabled={status !== "playing"}
                >
                  ⌫
                </button>
              ) : null}
            </div>
          ))}
        </div>

        {status === "playing" ? (
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            <span className="inline-block rounded border border-ring/60 px-1.5 py-0.5">
              Ring
            </span>{" "}
            = in your current row ·{" "}
            <span className="opacity-50">Faded</span> = not used in a guess yet
          </p>
        ) : null}

        {showEnd ? (
          <div className="rounded-lg border border-border bg-card p-4 text-center shadow-sm">
            <p className="text-lg font-semibold">
              {status === "won"
                ? `You got it in ${guesses.length} ${guesses.length === 1 ? "try" : "tries"}!`
                : `The word was ${solution.toUpperCase()}`}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button type="button" variant="default" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" aria-hidden />
                {copied ? "Copied!" : "Share"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/games">More games</Link>
              </Button>
            </div>
            <pre className="mt-4 max-h-32 overflow-auto rounded-md bg-muted/50 p-3 text-left text-xs text-muted-foreground">
              {shareText()}
            </pre>
          </div>
        ) : null}

        <p className="text-center text-xs text-muted-foreground">
          {WORDLE_STATS.solutionCount.toLocaleString()} possible answers · guesses:
          any five letters A–Z
        </p>
      </div>
    </div>
  );
}

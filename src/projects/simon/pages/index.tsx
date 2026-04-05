import { Link } from "react-router-dom";
import { ChevronLeft, Sparkles, Volume2 } from "lucide-react";
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
import { useSimon } from "../hooks/useSimon";
import type { PadId } from "../utils/simon";

import "./index.css";

const PAD_ORDER: PadId[] = [0, 1, 2, 3];
const PAD_LABELS = ["Green", "Red", "Yellow", "Blue"] as const;

export default function SimonPage() {
  const { phase, score, best, litPad, start, resetIdle, padPress } = useSimon();

  const inputOnly = phase === "input";

  return (
    <div className="simon-shell min-h-[calc(100vh-4rem)] bg-background px-4 pb-16 pt-24 text-foreground md:pt-28">
      <PageMeta
        title="Simon"
        description="Watch the sequence, then repeat it — each round adds a new step. Sound on for tones."
        path="/simon"
      />
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
            <Link to="/games">
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Games
            </Link>
          </Button>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Volume2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Unmute device if you hear nothing
          </p>
        </header>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" aria-hidden />
            <h1 className="font-serif text-3xl font-semibold tracking-tight">
              Simon
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Watch the pattern, then tap the pads in the same order.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <div className="rounded-md border border-border bg-muted/50 px-3 py-2">
            <span className="text-muted-foreground">Score </span>
            <span className="font-bold tabular-nums">{score}</span>
          </div>
          <div className="rounded-md border border-border bg-muted/50 px-3 py-2">
            <span className="text-muted-foreground">Best </span>
            <span className="font-bold tabular-nums">{best}</span>
          </div>
        </div>

        <p
          className="text-center text-sm font-medium text-muted-foreground"
          aria-live="polite"
        >
          {phase === "idle" && "Press start when you’re ready."}
          {phase === "playing" && "Watch…"}
          {phase === "input" && "Your turn — repeat the sequence."}
          {phase === "lost" && "Game over."}
        </p>

        <div className="simon-board-wrap">
          <div className="simon-board">
            {PAD_ORDER.map((id) => (
              <button
                key={id}
                type="button"
                className={cn(
                  "simon-pad",
                  `simon-pad--${id}`,
                  litPad === id && "simon-pad--lit",
                )}
                aria-label={PAD_LABELS[id]}
                disabled={!inputOnly}
                onClick={() => padPress(id)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {phase === "idle" || phase === "lost" ? (
            <Button type="button" size="lg" onClick={start}>
              {phase === "lost" ? "Play again" : "Start game"}
            </Button>
          ) : null}
          {phase !== "idle" ? (
            <Button type="button" variant="outline" onClick={resetIdle}>
              Quit
            </Button>
          ) : null}
        </div>
      </div>

      <Dialog open={phase === "lost"} onOpenChange={(o) => !o && resetIdle()}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Game over</DialogTitle>
            <DialogDescription>
              Final score:{" "}
              <span className="font-semibold text-foreground">{score}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={resetIdle}>
              Menu
            </Button>
            <Button type="button" onClick={start}>
              Play again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

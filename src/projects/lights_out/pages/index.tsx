import { Link } from "react-router-dom";
import { ChevronLeft, Lightbulb, RotateCcw } from "lucide-react";
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
import { useLightsOut } from "../hooks/useLightsOut";
import { SIZE } from "../utils/lightsOut";

import "./index.css";

export default function LightsOutPage() {
  const { board, moves, won, press, newGame, dismissWin } = useLightsOut();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background px-4 pb-16 pt-24 text-foreground md:pt-28">
      <PageMeta
        title="Lights Out"
        description="Tap lights to flip neighbors — turn the whole grid off."
        path="/lights-out"
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
            className="gap-1.5"
            onClick={newGame}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            New puzzle
          </Button>
        </header>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Lightbulb className="h-8 w-8 text-primary" aria-hidden />
            <h1 className="font-serif text-3xl font-semibold tracking-tight">
              Lights Out
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Each tap toggles that light and the four adjacent lights. Turn every
            light off.
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Moves: <span className="font-semibold text-foreground">{moves}</span>
        </p>

        <div className="lo-board-wrap">
          <div
            className="lo-grid"
            role="grid"
            aria-label={`${SIZE} by ${SIZE} lights`}
          >
            {board.map((row, r) =>
              row.map((on, c) => (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  className={cn(
                    "lo-cell",
                    on ? "lo-cell--on" : "lo-cell--off",
                  )}
                  aria-label={on ? "Light on" : "Light off"}
                  aria-pressed={on === 1}
                  onClick={() => press(r, c)}
                />
              )),
            )}
          </div>
        </div>
      </div>

      <Dialog open={won} onOpenChange={(o) => !o && dismissWin()}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>All out!</DialogTitle>
            <DialogDescription>
              You cleared the board in{" "}
              <span className="font-semibold text-foreground">{moves}</span>{" "}
              moves.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={dismissWin}>
              Next puzzle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

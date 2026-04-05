import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bomb,
  Brain,
  Building2,
  CarFront,
  CircleDot,
  Code2,
  Columns2,
  Crosshair,
  Crown,
  Dice6,
  Egg,
  Gamepad2,
  Grid2x2,
  Grid3x3,
  Hand,
  Hash,
  LayoutGrid,
  Lightbulb,
  Medal,
  Music2,
  Radio,
  RectangleHorizontal,
  Sparkles,
  Sword,
  Type,
  Zap,
  ChevronRight,
  Search,
  Spade,
  Swords,
  TrendingUp,
  Club,
  Diamond,
  Castle,
  Link2,
  Layers2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageMeta } from "@/components/PageMeta";
import Section, { SectionHeader } from "@/components/Section";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type GameEntry = {
  id: number;
  title: string;
  url: string;
  Icon: LucideIcon;
  category: string;
};

const games: GameEntry[] = [
  { id: 9, title: "Dominion", url: "/dominion", Icon: Crown, category: "Deck-building" },
  { id: 1, title: "Farkle", url: "/farkle", Icon: Dice6, category: "Dice" },
  { id: 2, title: "Checkers", url: "/checkers", Icon: CircleDot, category: "Board" },
  { id: 3, title: "Chess", url: "/chess", Icon: Medal, category: "Board" },
  { id: 4, title: "Hangman", url: "/hangman", Icon: Type, category: "Word" },
  { id: 5, title: "Memory Matcher", url: "/memory", Icon: Brain, category: "Puzzle" },
  { id: 6, title: "Rock Paper Scissors", url: "/rps", Icon: Hand, category: "Classic" },
  { id: 10, title: "Tic Tac Toe", url: "/ttt", Icon: Grid3x3, category: "Classic" },
  { id: 7, title: "Snake", url: "/snake", Icon: Gamepad2, category: "Arcade" },
  { id: 8, title: "Frogger", url: "/frogger", Icon: CarFront, category: "Arcade" },
  { id: 11, title: "Asteroids", url: "/asteroids", Icon: Zap, category: "Arcade" },
  { id: 12, title: "Code Challenge", url: "/code_challenge", Icon: Code2, category: "Puzzle" },
  { id: 13, title: "RPG", url: "/rpg", Icon: Sword, category: "Adventure" },
  { id: 14, title: "Dino Drop", url: "/dino_drop", Icon: Egg, category: "Arcade" },
  { id: 15, title: "Ethereal Quest", url: "/eq", Icon: Sparkles, category: "Adventure" },
  { id: 16, title: "Sound Haven", url: "/sound_haven", Icon: Music2, category: "Audio" },
  { id: 17, title: "Invaders", url: "/invaders", Icon: Crosshair, category: "Arcade" },
  { id: 18, title: "Monopoly", url: "/monopoly", Icon: Building2, category: "Board" },
  { id: 19, title: "Daily Wordle", url: "/wordle", Icon: Hash, category: "Word" },
  { id: 20, title: "2048", url: "/2048", Icon: Grid2x2, category: "Puzzle" },
  { id: 21, title: "Minesweeper", url: "/minesweeper", Icon: Bomb, category: "Puzzle" },
  { id: 22, title: "Connect Four", url: "/connect4", Icon: Columns2, category: "Board" },
  { id: 23, title: "Simon", url: "/simon", Icon: Radio, category: "Classic" },
  { id: 24, title: "Lights Out", url: "/lights-out", Icon: Lightbulb, category: "Puzzle" },
  { id: 25, title: "Breakout", url: "/breakout", Icon: RectangleHorizontal, category: "Arcade" },
  { id: 26, title: "Sudoku", url: "/sudoku", Icon: LayoutGrid, category: "Puzzle" },
  { id: 27, title: "Blackjack", url: "/blackjack", Icon: Spade, category: "Cards" },
  { id: 28, title: "War", url: "/war", Icon: Swords, category: "Cards" },
  { id: 29, title: "Higher or Lower", url: "/high-low", Icon: TrendingUp, category: "Cards" },
  { id: 30, title: "Crazy Eights", url: "/crazy-eights", Icon: Club, category: "Cards" },
  { id: 31, title: "Texas Hold'em", url: "/holdem", Icon: Diamond, category: "Cards" },
  { id: 32, title: "Tower Defense", url: "/tower-defense", Icon: Castle, category: "Arcade" },
  { id: 33, title: "Connections", url: "/connections", Icon: Link2, category: "Word" },
  { id: 34, title: "Mahjong Solitaire", url: "/mahjong", Icon: Layers2, category: "Puzzle" },
];

const iconTones = [
  "bg-primary/15 text-primary",
  "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  "bg-violet-500/15 text-violet-600 dark:text-violet-400",
];

const categories = [...new Set(games.map((g) => g.category))].sort((a, b) =>
  a.localeCompare(b),
);

function gameMatchesQuery(game: GameEntry, raw: string): boolean {
  const q = raw.trim().toLowerCase();
  if (!q) return true;
  const slug = game.url.replace(/^\//, "").replace(/_/g, "-");
  const slugCompact = slug.replace(/-/g, "");
  const qCompact = q.replace(/[\s-]+/g, "");
  return (
    game.title.toLowerCase().includes(q) ||
    game.category.toLowerCase().includes(q) ||
    slug.includes(q) ||
    (qCompact.length > 0 && slugCompact.includes(qCompact))
  );
}

const GamesList = () => {
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | string>("all");

  const filtered = useMemo(() => {
    return games.filter(
      (g) =>
        (category === "all" || g.category === category) &&
        gameMatchesQuery(g, query),
    );
  }, [category, query]);

  return (
    <>
      <PageMeta
        title="Games"
        description="Browser games built with TypeScript, React, and Vite — play in the tab."
        path="/games"
      />
      <div className="bg-background text-foreground">
        <Section id="games-hub" className="pt-24 pb-20 md:pt-28 md:pb-24">
          <SectionHeader
            eyebrow="Play"
            title="Games"
            description="Quick to load, no install — board games, puzzles, and arcade-style experiments. Pick a tile to open it in this tab."
          />

          <div className="mx-auto mb-10 max-w-6xl space-y-6">
            <div className="relative max-w-md mx-auto sm:mx-0">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, category, or path…"
                className="h-11 rounded-xl border-border bg-background pl-10 pr-4 shadow-sm"
                aria-label="Search games"
                autoComplete="off"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              <button
                type="button"
                onClick={() => setCategory("all")}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  category === "all"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                )}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    category === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <p
              className="text-center text-sm text-muted-foreground sm:text-left"
              aria-live="polite"
            >
              {filtered.length === games.length
                ? `${games.length} games`
                : `Showing ${filtered.length} of ${games.length} games`}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
              <p className="font-medium text-foreground">No games match</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try another search or choose &ldquo;All&rdquo; to reset categories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
                className="mt-6 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Clear filters
              </button>
            </div>
          ) : (
          <ul
            className="mx-auto grid max-w-6xl list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            {filtered.map((game, index) => {
              const Icon = game.Icon;
              const idx = games.findIndex((g) => g.id === game.id);
              const tone = iconTones[(idx >= 0 ? idx : 0) % iconTones.length]!;
              return (
                <motion.li
                  key={game.id}
                  className="min-w-0"
                  layout={!reduceMotion}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.35,
                    delay: reduceMotion ? 0 : Math.min(index * 0.03, 0.45),
                  }}
                  viewport={{ once: true, margin: "-40px" }}
                >
                  <Link
                    to={game.url}
                    className={cn(
                      "group flex h-full gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300",
                      "hover:border-primary/35 hover:shadow-md",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                        tone,
                      )}
                      aria-hidden
                    >
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif text-lg font-semibold leading-snug tracking-tight text-card-foreground transition-colors group-hover:text-primary">
                        {game.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {game.category}
                      </p>
                    </div>
                    <ChevronRight
                      className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-foreground"
                      aria-hidden
                    />
                  </Link>
                </motion.li>
              );
            })}
          </ul>
          )}

          <p className="mx-auto mt-14 max-w-xl text-center text-sm text-muted-foreground">
            Building something similar? See the rest of the portfolio on the{" "}
            <Link
              to="/projects"
              className="font-medium text-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
            >
              projects page
            </Link>
            .
          </p>
        </Section>
      </div>
    </>
  );
};

export default GamesList;

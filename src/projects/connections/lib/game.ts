import type {
  ConnectionPuzzle,
  PlacedWord,
  SubmitResult,
  SolvedStrip,
} from "./types";

export const MAX_MISTAKES = 4;

export function makePlacedWords(puzzle: ConnectionPuzzle): PlacedWord[] {
  return puzzle.groups.flatMap((g, groupIndex) =>
    g.words.map((word) => ({
      id: `${puzzle.id}-g${groupIndex}-${word}`,
      word,
      groupIndex,
    })),
  );
}

export function shuffledRemaining(words: PlacedWord[]): PlacedWord[] {
  const copy = [...words];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function evaluateSelection(
  puzzle: ConnectionPuzzle,
  remaining: PlacedWord[],
  selectedIds: string[],
): SubmitResult {
  if (selectedIds.length !== 4) return { kind: "need_four" };

  const set = new Set(selectedIds);
  const cells = remaining.filter((w) => set.has(w.id));
  if (cells.length !== 4) return { kind: "need_four" };

  const firstGi = cells[0]!.groupIndex;
  const allSame = cells.every((c) => c.groupIndex === firstGi);

  if (allSame) {
    const g = puzzle.groups[firstGi]!;
    const strip: SolvedStrip = {
      groupIndex: firstGi,
      title: g.title,
      words: [...g.words],
      difficulty: g.difficulty,
    };
    return { kind: "solved", strip };
  }

  const counts = new Map<number, number>();
  for (const c of cells) {
    counts.set(c.groupIndex, (counts.get(c.groupIndex) ?? 0) + 1);
  }
  const maxInOneGroup = Math.max(...counts.values());
  const oneAway = maxInOneGroup === 3;

  return { kind: "wrong", oneAway };
}

export function filterOutGroup(
  remaining: PlacedWord[],
  groupIndex: number,
): PlacedWord[] {
  return remaining.filter((w) => w.groupIndex !== groupIndex);
}

export function difficultyBarClass(d: 1 | 2 | 3 | 4): string {
  switch (d) {
    case 1:
      return "bg-amber-400/90 dark:bg-amber-500/90";
    case 2:
      return "bg-emerald-500/90 dark:bg-emerald-600/90";
    case 3:
      return "bg-sky-500/90 dark:bg-sky-600/90";
    case 4:
      return "bg-violet-600/90 dark:bg-violet-500/90";
    default:
      return "bg-muted";
  }
}

export type LetterResult = "correct" | "present" | "absent";

/** Wordle-style scoring: greens first, then yellows with correct multiset counts. */
export function gradeGuess(answer: string, guess: string): LetterResult[] {
  const a = answer.toLowerCase();
  const g = guess.toLowerCase();
  if (a.length !== 5 || g.length !== 5) {
    throw new Error("answer and guess must be 5 letters");
  }
  const result: LetterResult[] = Array(5).fill("absent");
  const remaining = new Map<string, number>();
  for (const ch of a) {
    remaining.set(ch, (remaining.get(ch) ?? 0) + 1);
  }

  for (let i = 0; i < 5; i++) {
    if (g[i] === a[i]) {
      result[i] = "correct";
      remaining.set(g[i], (remaining.get(g[i]) ?? 0) - 1);
    }
  }

  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    const c = g[i];
    const n = remaining.get(c) ?? 0;
    if (n > 0) {
      result[i] = "present";
      remaining.set(c, n - 1);
    }
  }

  return result;
}

/** Stable index for a calendar day string `YYYY-MM-DD`. */
export function dailyIndex(dateKey: string, modulo: number): number {
  if (modulo <= 0) return 0;
  let h = 5381;
  for (let i = 0; i < dateKey.length; i++) {
    h = (h * 33 + dateKey.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % modulo;
}

export function localDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const EMOJI: Record<LetterResult, string> = {
  correct: "🟩",
  present: "🟨",
  absent: "⬜",
};

export function rowsToShareEmoji(rows: LetterResult[][]): string {
  return rows.map((row) => row.map((r) => EMOJI[r]).join("")).join("\n");
}

import wordlistRaw from "./wordlist.txt?raw";
import { dailyIndex } from "../utils/wordleLogic";

const allWords = wordlistRaw
  .trim()
  .split("\n")
  .map((w) => w.trim().toLowerCase())
  .filter((w) => /^[a-z]{5}$/.test(w));

/**
 * Daily solutions are drawn from a middle slice of the sorted dictionary to avoid
 * the most obscure entries at the start of the file while keeping ~1.5k variety.
 */
const SOLUTION_POOL = allWords.slice(400, Math.min(2200, allWords.length));

export function getSolutionForDate(dateKey: string): string {
  if (SOLUTION_POOL.length === 0) {
    return "crane";
  }
  const idx = dailyIndex(dateKey, SOLUTION_POOL.length);
  return SOLUTION_POOL[idx];
}

/** Any five letters a–z (same freedom as many Wordle clones; dict is too sparse for play). */
export function isValidWord(word: string): boolean {
  return /^[a-z]{5}$/.test(word.toLowerCase());
}

export const WORDLE_STATS = {
  solutionCount: SOLUTION_POOL.length,
} as const;

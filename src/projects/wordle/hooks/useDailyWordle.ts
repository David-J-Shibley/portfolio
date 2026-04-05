import { useCallback, useEffect, useMemo, useState } from "react";
import { getSolutionForDate, isValidWord } from "../data/loadWords";
import {
  gradeGuess,
  type LetterResult,
  localDateKey,
  rowsToShareEmoji,
} from "../utils/wordleLogic";

const STORAGE_DAY = "portfolio-wordle-v1-day";
const STORAGE_STATS = "portfolio-wordle-v1-stats";

export type GameStatus = "playing" | "won" | "lost";

export interface DayPersist {
  dateKey: string;
  guesses: string[];
  results: LetterResult[][];
  status: GameStatus;
}

export interface GlobalStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  lastCompletedDate: string | null;
  lastOutcome: "won" | "lost" | null;
}

function loadDay(): DayPersist | null {
  try {
    const raw = localStorage.getItem(STORAGE_DAY);
    if (!raw) return null;
    return JSON.parse(raw) as DayPersist;
  } catch {
    return null;
  }
}

function saveDay(s: DayPersist) {
  localStorage.setItem(STORAGE_DAY, JSON.stringify(s));
}

function loadStats(): GlobalStats {
  try {
    const raw = localStorage.getItem(STORAGE_STATS);
    if (!raw) {
      return {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        lastCompletedDate: null,
        lastOutcome: null,
      };
    }
    return JSON.parse(raw) as GlobalStats;
  } catch {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      lastCompletedDate: null,
      lastOutcome: null,
    };
  }
}

function saveStats(s: GlobalStats) {
  localStorage.setItem(STORAGE_STATS, JSON.stringify(s));
}

function previousCalendarDay(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  return localDateKey(dt);
}

export function keyboardLetterStates(
  guesses: string[],
  results: LetterResult[][],
): Record<string, LetterResult> {
  const rank: Record<LetterResult, number> = {
    absent: 0,
    present: 1,
    correct: 2,
  };
  const map: Partial<Record<string, LetterResult>> = {};
  for (let r = 0; r < guesses.length; r++) {
    const g = guesses[r];
    const res = results[r];
    for (let i = 0; i < 5; i++) {
      const ch = g[i];
      const next = res?.[i];
      if (next !== "correct" && next !== "present" && next !== "absent") {
        continue;
      }
      const prev = map[ch];
      if (!prev || rank[next] > rank[prev]) {
        map[ch] = next;
      }
    }
  }
  return map as Record<string, LetterResult>;
}

const ROWS = 6;

function isValidResultRow(row: unknown): row is LetterResult[] {
  if (!Array.isArray(row) || row.length !== 5) return false;
  return row.every(
    (c) => c === "correct" || c === "present" || c === "absent",
  );
}

function readInitialDay(todayKey: string): Pick<
  DayPersist,
  "guesses" | "results" | "status"
> {
  const saved = loadDay();
  if (saved?.dateKey === todayKey) {
    const guesses = Array.isArray(saved.guesses) ? saved.guesses : [];
    let results = Array.isArray(saved.results) ? saved.results : [];
    const status = saved.status ?? "playing";

    const resultsOk =
      results.length === guesses.length &&
      results.every((row) => isValidResultRow(row));

    if (guesses.length > 0 && !resultsOk) {
      const solution = getSolutionForDate(todayKey);
      results = guesses.map((g) =>
        g.length === 5
          ? gradeGuess(solution, g)
          : (["absent", "absent", "absent", "absent", "absent"] as LetterResult[]),
      );
    }

    return { guesses, results, status };
  }
  return { guesses: [], results: [], status: "playing" };
}

export function useDailyWordle() {
  const [boot] = useState(() => {
    const k = localDateKey();
    return { todayKey: k, ...readInitialDay(k) };
  });
  const { todayKey } = boot;
  const solution = useMemo(() => getSolutionForDate(todayKey), [todayKey]);

  const [guesses, setGuesses] = useState<string[]>(() => boot.guesses);
  const [results, setResults] = useState<LetterResult[][]>(() => boot.results);
  const [status, setStatus] = useState<GameStatus>(() => boot.status);
  const [current, setCurrent] = useState("");
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<GlobalStats>(loadStats);

  useEffect(() => {
    if (guesses.length === 0 && results.length === 0 && status === "playing") {
      return;
    }
    saveDay({
      dateKey: todayKey,
      guesses,
      results,
      status,
    });
  }, [todayKey, guesses, results, status]);

  const applyStatsAfterGame = useCallback(
    (outcome: "won" | "lost") => {
      const prev = loadStats();
      const played = prev.gamesPlayed + 1;
      let wins = prev.gamesWon;
      let streak = prev.currentStreak;
      let maxS = prev.maxStreak;

      if (outcome === "won") {
        wins += 1;
        const yday = previousCalendarDay(todayKey);
        if (prev.lastCompletedDate === yday && prev.lastOutcome === "won") {
          streak = prev.currentStreak + 1;
        } else {
          streak = 1;
        }
        maxS = Math.max(maxS, streak);
      } else {
        streak = 0;
      }

      const next: GlobalStats = {
        gamesPlayed: played,
        gamesWon: wins,
        currentStreak: streak,
        maxStreak: maxS,
        lastCompletedDate: todayKey,
        lastOutcome: outcome,
      };
      saveStats(next);
      setStats(next);
    },
    [todayKey],
  );

  const submitRow = useCallback(() => {
    if (status !== "playing") return;
    const word = current.toLowerCase();
    if (word.length !== 5) {
      setMessage("Not enough letters");
      setShakeRow(guesses.length);
      setTimeout(() => setShakeRow(null), 450);
      return;
    }
    if (!isValidWord(word)) {
      setMessage("Use five letters A–Z — press ⌫ to edit.");
      setShakeRow(guesses.length);
      setTimeout(() => setShakeRow(null), 450);
      setCurrent("");
      return;
    }

    const row = gradeGuess(solution, word);
    const nextGuesses = [...guesses, word];
    const nextResults = [...results, row];
    setGuesses(nextGuesses);
    setResults(nextResults);
    setCurrent("");
    setMessage(null);

    const won = row.every((r) => r === "correct");
    if (won) {
      setStatus("won");
      applyStatsAfterGame("won");
    } else if (nextGuesses.length >= ROWS) {
      setStatus("lost");
      applyStatsAfterGame("lost");
    }
  }, [status, current, guesses, results, solution, applyStatsAfterGame]);

  const addLetter = useCallback(
    (ch: string) => {
      if (status !== "playing") return;
      const lower = ch.toLowerCase();
      if (!/^[a-z]$/.test(lower)) return;
      setCurrent((c) => {
        if (c.length >= 5) return c;
        return c + lower;
      });
      setMessage(null);
    },
    [status],
  );

  const backspace = useCallback(() => {
    if (status !== "playing") return;
    setCurrent((c) => c.slice(0, -1));
    setMessage(null);
  }, [status]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (status !== "playing") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Enter") {
        e.preventDefault();
        submitRow();
        return;
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        backspace();
        return;
      }
      if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        addLetter(e.key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, submitRow, backspace, addLetter]);

  const keyStates = useMemo(
    () => keyboardLetterStates(guesses, results),
    [guesses, results],
  );

  const shareText = useCallback(() => {
    const header = `Portfolio Wordle ${todayKey} ${guesses.length}/${ROWS}`;
    const grid = rowsToShareEmoji(results);
    return grid ? `${header}\n${grid}` : header;
  }, [todayKey, guesses.length, results]);

  const copyShare = useCallback(async () => {
    const text = shareText();
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }, [shareText]);

  return {
    todayKey,
    solution,
    guesses,
    results,
    status,
    current,
    shakeRow,
    message,
    setMessage,
    stats,
    keyStates,
    submitRow,
    addLetter,
    backspace,
    shareText,
    copyShare,
    rows: ROWS,
  };
}

import { useCallback, useEffect, useRef, useState } from "react";
import {
  checkStep,
  extendSequence,
  gapDurationMs,
  type PadId,
  stepDurationMs,
} from "../utils/simon";

const BEST_KEY = "portfolio-simon-best";

function loadBest(): number {
  try {
    const v = localStorage.getItem(BEST_KEY);
    if (!v) return 0;
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function saveBest(n: number) {
  localStorage.setItem(BEST_KEY, String(n));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let audioCtx: AudioContext | null = null;

function getAudio(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

/** Classic-ish frequencies per quadrant. */
const FREQ: number[] = [329.63, 261.63, 220, 164.81];

export function playPadTone(pad: PadId): void {
  try {
    const ctx = getAudio();
    void ctx.resume();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = FREQ[pad];
    g.gain.value = 0.11;
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.19);
  } catch {
    /* ignore */
  }
}

type Phase = "idle" | "playing" | "input" | "lost";

export function useSimon() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [sequence, setSequence] = useState<PadId[]>([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(loadBest);
  const [litPad, setLitPad] = useState<PadId | null>(null);
  const [playId, setPlayId] = useState(0);

  const inputIndexRef = useRef(0);
  const sequenceRef = useRef<PadId[]>([]);
  const scoreRef = useRef(0);
  sequenceRef.current = sequence;
  scoreRef.current = score;

  useEffect(() => {
    if (phase !== "playing") return;

    let cancelled = false;
    const seq = sequence;
    const rounds = Math.max(0, seq.length - 1);

    (async () => {
      for (let i = 0; i < seq.length; i++) {
        if (cancelled) return;
        await sleep(gapDurationMs(rounds));
        if (cancelled) return;
        const p = seq[i];
        setLitPad(p);
        playPadTone(p);
        await sleep(stepDurationMs(rounds));
        if (cancelled) return;
        setLitPad(null);
      }
      if (cancelled) return;
      inputIndexRef.current = 0;
      setPhase("input");
    })();

    return () => {
      cancelled = true;
      setLitPad(null);
    };
  }, [phase, playId, sequence]);

  const start = useCallback(() => {
    const first = extendSequence([]);
    setSequence(first);
    setScore(0);
    setPhase("playing");
    setPlayId((n) => n + 1);
  }, []);

  const resetIdle = useCallback(() => {
    setPhase("idle");
    setSequence([]);
    setScore(0);
    setLitPad(null);
  }, []);

  const padPress = useCallback(
    (pad: PadId) => {
      if (phase === "playing") return;
      if (phase === "idle") return;

      if (phase === "lost") return;

      if (phase === "input") {
        const seq = sequenceRef.current;
        const idx = inputIndexRef.current;
        playPadTone(pad);
        setLitPad(pad);
        window.setTimeout(() => setLitPad(null), 120);

        if (!checkStep(seq, idx, pad)) {
          setPhase("lost");
          setBest((b) => {
            const s = scoreRef.current;
            if (s > b) {
              saveBest(s);
              return s;
            }
            return b;
          });
          return;
        }

        if (idx === seq.length - 1) {
          setScore((s) => s + 1);
          const nextSeq = extendSequence(seq);
          setSequence(nextSeq);
          setPhase("playing");
          setPlayId((n) => n + 1);
          return;
        }

        inputIndexRef.current = idx + 1;
      }
    },
    [phase],
  );

  return {
    phase,
    sequence,
    score,
    best,
    litPad,
    start,
    resetIdle,
    padPress,
  };
}

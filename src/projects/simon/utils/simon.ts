export const PAD_COUNT = 4;

export type PadId = 0 | 1 | 2 | 3;

const STEP_MS_BASE = 520;
const GAP_MS_BASE = 180;

export function randomPad(): PadId {
  return Math.floor(Math.random() * PAD_COUNT) as PadId;
}

export function extendSequence(seq: readonly PadId[]): PadId[] {
  return [...seq, randomPad()];
}

export function checkStep(
  seq: readonly PadId[],
  stepIndex: number,
  pressed: PadId,
): boolean {
  if (stepIndex < 0 || stepIndex >= seq.length) return false;
  return seq[stepIndex] === pressed;
}

/** Playback timing: faster as score grows (score = completed rounds). */
export function stepDurationMs(score: number): number {
  const t = Math.max(STEP_MS_BASE - score * 18, 280);
  return t;
}

export function gapDurationMs(score: number): number {
  const t = Math.max(GAP_MS_BASE - score * 6, 80);
  return t;
}

const _kinds = (["b", "c", "d"] as const).flatMap((s) =>
  [1, 2, 3, 4, 5, 6].map((n) => `${s}${n}` as const),
);

/** 18 kinds × 2 = 36 tiles (compact solitaire set). */
export type TileKind = (typeof _kinds)[number];

export const ALL_TILE_KINDS_LIST: TileKind[] = [..._kinds];

export function pairDeck(): TileKind[] {
  return [...ALL_TILE_KINDS_LIST, ...ALL_TILE_KINDS_LIST];
}

export type TileStyle = {
  label: string;
  /** Short suit name for screen readers */
  suit: string;
  suitClass: string;
};

export const TILE_STYLE: Record<TileKind, TileStyle> = {} as Record<
  TileKind,
  TileStyle
>;

for (const s of ["b", "c", "d"] as const) {
  const suitName = s === "b" ? "Bamboo" : s === "c" ? "Characters" : "Dots";
  const suitClass =
    s === "b"
      ? "border-emerald-700/50 bg-emerald-950/40 text-emerald-100"
      : s === "c"
        ? "border-rose-700/50 bg-rose-950/40 text-rose-100"
        : "border-sky-700/50 bg-sky-950/40 text-sky-100";
  for (let n = 1; n <= 6; n++) {
    const k = `${s}${n}` as TileKind;
    TILE_STYLE[k] = {
      label: String(n),
      suit: suitName,
      suitClass,
    };
  }
}

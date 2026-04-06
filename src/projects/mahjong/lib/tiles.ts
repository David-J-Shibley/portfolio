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
  /** On-tile abbreviation (Bams / Wan / Dots) */
  abbrev: string;
  suitClass: string;
  /** Face gradient + rim */
  faceClass: string;
};

export const TILE_STYLE: Record<TileKind, TileStyle> = {} as Record<
  TileKind,
  TileStyle
>;

for (const s of ["b", "c", "d"] as const) {
  const suitName = s === "b" ? "Bamboo" : s === "c" ? "Characters" : "Dots";
  const abbrev = s === "b" ? "BAM" : s === "c" ? "WAN" : "DOT";
  const suitClass =
    s === "b"
      ? "border-emerald-800/70 text-emerald-50"
      : s === "c"
        ? "border-rose-800/70 text-rose-50"
        : "border-sky-800/70 text-sky-50";
  const faceClass =
    s === "b"
      ? "from-emerald-950/90 via-emerald-900/85 to-emerald-950/95"
      : s === "c"
        ? "from-rose-950/90 via-rose-900/85 to-rose-950/95"
        : "from-sky-950/90 via-sky-900/85 to-sky-950/95";
  for (let n = 1; n <= 6; n++) {
    const k = `${s}${n}` as TileKind;
    TILE_STYLE[k] = {
      label: String(n),
      suit: suitName,
      abbrev,
      suitClass,
      faceClass,
    };
  }
}

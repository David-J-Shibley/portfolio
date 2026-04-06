import { cn } from "@/lib/utils";
import {
  tileAriaDescription,
  tileFaceParts,
  type TileTone,
} from "../lib/tileSet";

const toneText: Record<TileTone, string> = {
  bamboo: "text-emerald-800 dark:text-emerald-200",
  character: "text-rose-800 dark:text-rose-200",
  dot: "text-sky-800 dark:text-sky-200",
  honor: "text-slate-800 dark:text-slate-100",
};

const toneCategory: Record<TileTone, string> = {
  bamboo: "text-emerald-700/90 dark:text-emerald-300/90",
  character: "text-rose-700/90 dark:text-rose-300/90",
  dot: "text-sky-700/90 dark:text-sky-300/90",
  honor: "text-slate-600 dark:text-slate-300",
};

const sizes = {
  sm: {
    wrap: "min-h-[2.35rem] min-w-[1.65rem] px-1 py-0.5 rounded-md border-b-[2px]",
    cat: "text-[0.45rem] leading-none",
    main: "text-sm font-bold leading-none",
  },
  md: {
    wrap: "min-h-[3.35rem] min-w-[2.35rem] px-1.5 py-1 rounded-lg border-b-[3px]",
    cat: "text-[0.5rem] leading-tight tracking-wide",
    main: "text-xl font-black leading-none tracking-tight",
  },
  lg: {
    wrap: "min-h-[4rem] min-w-[2.85rem] max-w-[4.5rem] px-2 py-1.5 rounded-xl border-b-[4px]",
    cat: "text-[0.55rem] leading-tight tracking-wider",
    main: "text-2xl font-black leading-none tracking-tight",
    /** Honors use words (e.g. South); keep readable without clipping. */
    mainHonor: "text-base font-black leading-tight tracking-tight sm:text-xl",
  },
} as const;

export type MahjongTileSize = keyof typeof sizes;

export function MahjongTileFace({
  tile,
  size = "md",
  className,
}: {
  tile: number;
  size?: MahjongTileSize;
  className?: string;
}) {
  const { category, main, tone } = tileFaceParts(tile);
  const s = sizes[size];

  return (
    <span
      className={cn(
        "inline-flex select-none flex-col items-center justify-center border border-stone-300/90 bg-gradient-to-b from-stone-50 via-amber-50/80 to-stone-100 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_2px_4px_rgba(0,0,0,0.08)] dark:border-stone-600 dark:from-stone-800 dark:via-stone-800/95 dark:to-stone-900 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_2px_6px_rgba(0,0,0,0.35)]",
        "border-b-stone-400/90 dark:border-b-stone-950",
        s.wrap,
        className,
      )}
      aria-hidden
    >
      <span
        className={cn(
          "max-w-full truncate font-semibold uppercase",
          toneCategory[tone],
          s.cat,
        )}
      >
        {category}
      </span>
      <span
        className={cn(
          "mt-0.5 text-balance",
          toneText[tone],
          tone === "honor" && "mainHonor" in s ? s.mainHonor : s.main,
        )}
      >
        {main}
      </span>
    </span>
  );
}

export function mahjongTileAriaLabel(tile: number): string {
  return tileAriaDescription(tile);
}

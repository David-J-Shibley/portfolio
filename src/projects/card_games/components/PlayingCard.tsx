import { cn } from "@/lib/utils";
import { isRed, suitSymbol, type Card } from "../lib/cards";

type Props = {
  card?: Card;
  faceDown?: boolean;
  className?: string;
  label?: string;
};

export function PlayingCard({ card, faceDown, className, label }: Props) {
  if (faceDown || !card) {
    return (
      <div
        className={cn(
          "flex aspect-[5/7] w-[4.5rem] flex-col items-center justify-center rounded-lg border-2 border-primary/40 bg-gradient-to-br from-primary/25 via-primary/10 to-primary/30 shadow-sm md:w-[5.25rem]",
          className,
        )}
        aria-label={label ?? "Hidden card"}
      >
        <div
          className="h-[55%] w-[70%] rounded border border-primary/35 opacity-80"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, hsl(var(--primary) / 0.15) 0 4px, transparent 4px 8px)",
          }}
        />
      </div>
    );
  }

  const red = isRed(card.suit);
  return (
    <div
      className={cn(
        "flex aspect-[5/7] w-[4.5rem] flex-col justify-between rounded-lg border-2 border-border bg-card p-1.5 shadow-sm md:w-[5.25rem]",
        red
          ? "text-red-600 dark:text-red-400"
          : "text-slate-900 dark:text-slate-100",
        className,
      )}
      aria-label={label ?? `${card.rank} of ${card.suit}`}
    >
      <div className="flex flex-col items-center leading-none">
        <span className="text-sm font-bold md:text-base">{card.rank}</span>
        <span className="text-lg md:text-xl" aria-hidden>
          {suitSymbol(card.suit)}
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <span className="text-3xl md:text-4xl" aria-hidden>
          {suitSymbol(card.suit)}
        </span>
      </div>
      <div className="flex flex-col items-center rotate-180 leading-none">
        <span className="text-sm font-bold md:text-base">{card.rank}</span>
        <span className="text-lg md:text-xl" aria-hidden>
          {suitSymbol(card.suit)}
        </span>
      </div>
    </div>
  );
}

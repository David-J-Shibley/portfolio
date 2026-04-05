export type Suit = "H" | "D" | "C" | "S";

export type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

export interface Card {
  suit: Suit;
  rank: Rank;
}

const SUITS: Suit[] = ["H", "D", "C", "S"];
const RANKS: Rank[] = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

/** Fisher–Yates shuffle; optional `rng` for tests (return in [0,1)). */
export function shuffle<T>(items: T[], rng: () => number = Math.random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function suitSymbol(suit: Suit): string {
  switch (suit) {
    case "H":
      return "♥";
    case "D":
      return "♦";
    case "C":
      return "♣";
    case "S":
      return "♠";
  }
}

export function isRed(suit: Suit): boolean {
  return suit === "H" || suit === "D";
}

/** Best blackjack total (aces count 11 then 1 as needed). */
export function handTotal(cards: Card[]): number {
  let total = 0;
  let aces = 0;
  for (const c of cards) {
    const r = c.rank;
    if (r === "A") aces++;
    else if (r === "J" || r === "Q" || r === "K") total += 10;
    else if (r === "10") total += 10;
    else total += Number.parseInt(r, 10);
  }
  for (let i = 0; i < aces; i++) {
    if (total + 11 <= 21) total += 11;
    else total += 1;
  }
  return total;
}

export function isBust(cards: Card[]): boolean {
  return handTotal(cards) > 21;
}

export function isNaturalBlackjack(cards: Card[]): boolean {
  return cards.length === 2 && handTotal(cards) === 21;
}

export function isTenValueCard(c: Card): boolean {
  return (
    c.rank === "10" ||
    c.rank === "J" ||
    c.rank === "Q" ||
    c.rank === "K"
  );
}

/** Dealer shows ace or ten-value — hole is checked for blackjack before player acts. */
export function dealerUpNeedsPeek(up: Card): boolean {
  return up.rank === "A" || isTenValueCard(up);
}

/** War rank: 2 lowest, ace high. */
export function warRankValue(rank: Rank): number {
  if (rank === "A") return 14;
  if (rank === "J") return 11;
  if (rank === "Q") return 12;
  if (rank === "K") return 13;
  if (rank === "10") return 10;
  return Number.parseInt(rank, 10);
}

export function compareWarRanks(a: Rank, b: Rank): number {
  return warRankValue(a) - warRankValue(b);
}

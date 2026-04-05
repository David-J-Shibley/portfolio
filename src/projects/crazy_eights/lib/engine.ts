import {
  createDeck,
  shuffle,
  type Card,
  type Suit,
} from "@/projects/card_games/lib/cards";

/** Top of discard is last element. */
export function topDiscard(discard: Card[]): Card | undefined {
  return discard[discard.length - 1];
}

/** Whether `card` can be played on `top` with optional suit called on an 8. */
export function canPlayCard(
  card: Card,
  top: Card,
  eightSuit: Suit | null,
): boolean {
  if (card.rank === "8") return true;
  if (top.rank === "8" && eightSuit !== null) {
    return card.suit === eightSuit;
  }
  return card.rank === top.rank || card.suit === top.suit;
}

export function anyPlayable(
  hand: Card[],
  top: Card,
  eightSuit: Suit | null,
): boolean {
  return hand.some((c) => canPlayCard(c, top, eightSuit));
}

export function removeCard(hand: Card[], card: Card): Card[] {
  const i = hand.indexOf(card);
  if (i < 0) return hand;
  return [...hand.slice(0, i), ...hand.slice(i + 1)];
}

export function cpuChooseSuit(hand: Card[]): Suit {
  const counts: Record<Suit, number> = { H: 0, D: 0, C: 0, S: 0 };
  for (const c of hand) {
    counts[c.suit]++;
  }
  let best: Suit = "S";
  let n = -1;
  for (const s of ["H", "D", "C", "S"] as Suit[]) {
    if (counts[s] > n) {
      n = counts[s];
      best = s;
    }
  }
  return best;
}

/** Prefer non-8 if multiple legal plays. */
export function cpuPickCard(
  hand: Card[],
  top: Card,
  eightSuit: Suit | null,
): Card | null {
  const legal = hand.filter((c) => canPlayCard(c, top, eightSuit));
  if (legal.length === 0) return null;
  const non8 = legal.filter((c) => c.rank !== "8");
  return (non8.length > 0 ? non8[0] : legal[0])!;
}

/** If discard top is 8, bury it under the stock and flip a new starter. */
export function burnEightsFromStock(stock: Card[], discard: Card[]): {
  stock: Card[];
  discard: Card[];
} {
  let s = [...stock];
  let d = [...discard];
  while (d.length > 0 && d[d.length - 1]!.rank === "8" && s.length > 0) {
    const eight = d.pop()!;
    s.unshift(eight);
    const next = s.pop()!;
    d.push(next);
  }
  return { stock: s, discard: d };
}

/** Move all but the face-up top of discard into stock, shuffled. */
export function reshuffleDiscardIntoStock(
  stock: Card[],
  discard: Card[],
): { stock: Card[]; discard: Card[] } {
  const top = discard[discard.length - 1];
  const under = discard.slice(0, -1);
  if (!top) return { stock, discard };
  return {
    stock: [...stock, ...shuffle(under)],
    discard: [top],
  };
}

export function initialDeal(): {
  stock: Card[];
  discard: Card[];
  player: Card[];
  cpu: Card[];
} {
  const shuffled = shuffle(createDeck());
  const player = shuffled.slice(0, 7);
  const cpu = shuffled.slice(7, 14);
  let stock = shuffled.slice(14);
  const discard: Card[] = [];
  const first = stock.pop();
  if (first) discard.push(first);
  const b = burnEightsFromStock(stock, discard);
  return {
    stock: b.stock,
    discard: b.discard,
    player,
    cpu,
  };
}

export type EightsTurn = "player" | "cpu";

export type EightsCore = {
  stock: Card[];
  discard: Card[];
  player: Card[];
  cpu: Card[];
  eightSuit: Suit | null;
  turn: EightsTurn;
  winner: "player" | "cpu" | null;
};

export function runCpuTurn(s: EightsCore): EightsCore {
  if (s.winner || s.turn !== "cpu") return s;
  let stock = [...s.stock];
  let discard = [...s.discard];
  let cpu = [...s.cpu];
  let eightSuit = s.eightSuit;
  const topC = topDiscard(discard);
  if (!topC) return { ...s, turn: "player" };

  let pick = cpuPickCard(cpu, topC, eightSuit);
  let guard = 0;
  while (!pick && guard < 64) {
    guard++;
    if (stock.length === 0) {
      if (discard.length <= 1) break;
      const r = reshuffleDiscardIntoStock(stock, discard);
      stock = r.stock;
      discard = r.discard;
    }
    if (stock.length === 0) break;
    const drawn = stock.pop()!;
    cpu = [...cpu, drawn];
    pick = cpuPickCard(cpu, topDiscard(discard)!, eightSuit);
  }

  if (!pick) {
    return { ...s, stock, discard, cpu, eightSuit, turn: "player" };
  }

  cpu = removeCard(cpu, pick);
  discard = [...discard, pick];
  eightSuit = pick.rank === "8" ? cpuChooseSuit(cpu) : null;

  if (cpu.length === 0) {
    return { ...s, stock, discard, cpu, eightSuit, turn: "player", winner: "cpu" };
  }

  return { ...s, stock, discard, cpu, eightSuit, turn: "player" };
}

export function playerDrawOne(s: EightsCore): EightsCore {
  if (s.winner || s.turn !== "player") return s;
  const topC = topDiscard(s.discard);
  if (!topC) return s;
  if (anyPlayable(s.player, topC, s.eightSuit)) return s;

  let stock = [...s.stock];
  let discard = [...s.discard];
  if (stock.length === 0 && discard.length > 1) {
    const r = reshuffleDiscardIntoStock(stock, discard);
    stock = r.stock;
    discard = r.discard;
  }
  if (stock.length === 0) {
    return { ...s, stock, discard, turn: "cpu" };
  }
  const drawn = stock.pop()!;
  return {
    ...s,
    stock,
    discard,
    player: [...s.player, drawn],
  };
}

export function applyPlayerPlay(
  s: EightsCore,
  card: Card,
  eightChoice?: Suit,
): EightsCore {
  const topC = topDiscard(s.discard);
  if (!topC || s.winner || s.turn !== "player") return s;
  if (!canPlayCard(card, topC, s.eightSuit)) return s;
  if (card.rank === "8" && eightChoice === undefined) return s;
  const player = removeCard(s.player, card);
  const discard = [...s.discard, card];
  const eightSuit = card.rank === "8" ? eightChoice! : null;
  if (player.length === 0) {
    return { ...s, player, discard, eightSuit, winner: "player", turn: "cpu" };
  }
  return { ...s, player, discard, eightSuit, turn: "cpu" };
}

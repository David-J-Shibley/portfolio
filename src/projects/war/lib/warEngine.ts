import {
  compareWarRanks,
  createDeck,
  shuffle,
  type Card,
} from "@/projects/card_games/lib/cards";

export type WarBattles = { player: Card; cpu: Card }[];

export type WarRoundOk = {
  kind: "round";
  player: Card[];
  cpu: Card[];
  battles: WarBattles;
  winner: "player" | "cpu";
};

export type WarRoundEnd = {
  kind: "gameover";
  winner: "player" | "cpu";
  player: Card[];
  cpu: Card[];
};

/** Classic war: higher card wins the pot; ties add three cards each then flip again. */
export function playWarRound(player: Card[], cpu: Card[]): WarRoundOk | WarRoundEnd {
  const pot: Card[] = [];
  let p = [...player];
  let c = [...cpu];
  const battles: WarBattles = [];

  for (;;) {
    if (p.length === 0) {
      return { kind: "gameover", winner: "cpu", player: p, cpu: [...c, ...pot] };
    }
    if (c.length === 0) {
      return { kind: "gameover", winner: "player", player: [...p, ...pot], cpu: c };
    }

    const pc = p.shift()!;
    const cc = c.shift()!;
    pot.push(pc, cc);
    battles.push({ player: pc, cpu: cc });

    const cmp = compareWarRanks(pc.rank, cc.rank);
    if (cmp > 0) {
      return {
        kind: "round",
        player: [...p, ...pot],
        cpu: c,
        battles,
        winner: "player",
      };
    }
    if (cmp < 0) {
      return {
        kind: "round",
        player: p,
        cpu: [...c, ...pot],
        battles,
        winner: "cpu",
      };
    }

    for (let i = 0; i < 3; i++) {
      if (p.length === 0) {
        return { kind: "gameover", winner: "cpu", player: p, cpu: [...c, ...pot] };
      }
      if (c.length === 0) {
        return { kind: "gameover", winner: "player", player: [...p, ...pot], cpu: c };
      }
      pot.push(p.shift()!, c.shift()!);
    }
  }
}

export function splitDecks(): [Card[], Card[]] {
  const d = shuffle(createDeck());
  return [d.slice(0, 26), d.slice(26)];
}

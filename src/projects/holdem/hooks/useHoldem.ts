import { useCallback, useEffect, useState } from "react";
import { createDeck, shuffle, type Card } from "@/projects/card_games/lib/cards";
import { bestHand7, compareNamedHands } from "../lib/handEvaluator";
import { cpuPickAction } from "../lib/cpuBrain";

export const SB = 10;
export const BB = 20;
export const START_STACK = 2000;

type Street = "preflop" | "flop" | "turn" | "river";

export type HoldemPlaying = {
  status: "playing";
  buttonHero: boolean;
  heroStack: number;
  cpuStack: number;
  pot: number;
  deck: Card[];
  heroHole: Card[];
  cpuHole: Card[];
  board: Card[];
  street: Street;
  heroStreetBet: number;
  cpuStreetBet: number;
  actOrder: (0 | 1)[];
  folded: "hero" | "cpu" | null;
  lastRaiseSize: number;
  message: string;
};

export type HoldemIdle = {
  status: "idle";
  buttonHero: boolean;
  heroStack: number;
  cpuStack: number;
  message: string;
};

export type HoldemState = HoldemPlaying | HoldemIdle;

function sbIdx(buttonHero: boolean): 0 | 1 {
  return buttonHero ? 0 : 1;
}

function bbIdx(buttonHero: boolean): 0 | 1 {
  return buttonHero ? 1 : 0;
}

function maxStreet(s: HoldemPlaying): number {
  return Math.max(s.heroStreetBet, s.cpuStreetBet);
}

function heroToCall(s: HoldemPlaying): number {
  return maxStreet(s) - s.heroStreetBet;
}

function cpuToCall(s: HoldemPlaying): number {
  return maxStreet(s) - s.cpuStreetBet;
}

function minRaiseTotal(s: HoldemPlaying): number {
  return maxStreet(s) + s.lastRaiseSize;
}

function payHero(s: HoldemPlaying, amt: number): HoldemPlaying {
  const pay = Math.min(amt, s.heroStack);
  return {
    ...s,
    heroStack: s.heroStack - pay,
    heroStreetBet: s.heroStreetBet + pay,
    pot: s.pot + pay,
  };
}

function payCpu(s: HoldemPlaying, amt: number): HoldemPlaying {
  const pay = Math.min(amt, s.cpuStack);
  return {
    ...s,
    cpuStack: s.cpuStack - pay,
    cpuStreetBet: s.cpuStreetBet + pay,
    pot: s.pot + pay,
  };
}

function resolveShowdown(s: HoldemPlaying): HoldemIdle {
  const heroBest = bestHand7([...s.heroHole, ...s.board]);
  const cpuBest = bestHand7([...s.cpuHole, ...s.board]);
  const cmp = compareNamedHands(heroBest, cpuBest);
  let heroStack = s.heroStack;
  let cpuStack = s.cpuStack;
  let msg: string;
  if (cmp > 0) {
    heroStack += s.pot;
    msg = `You win (${heroBest.name}).`;
  } else if (cmp < 0) {
    cpuStack += s.pot;
    msg = `CPU wins (${cpuBest.name}).`;
  } else {
    heroStack += Math.floor(s.pot / 2);
    cpuStack += Math.floor(s.pot / 2);
    msg = `Chop pot (${heroBest.name}).`;
  }
  return {
    status: "idle",
    buttonHero: !s.buttonHero,
    heroStack,
    cpuStack,
    message: msg,
  };
}

function awardPotToCpu(s: HoldemPlaying): HoldemIdle {
  return {
    status: "idle",
    buttonHero: !s.buttonHero,
    heroStack: s.heroStack,
    cpuStack: s.cpuStack + s.pot,
    message: "You folded. CPU takes the pot.",
  };
}

function awardPotToHero(s: HoldemPlaying): HoldemIdle {
  return {
    status: "idle",
    buttonHero: !s.buttonHero,
    heroStack: s.heroStack + s.pot,
    cpuStack: s.cpuStack,
    message: "CPU folded. You take the pot.",
  };
}

function advanceStreet(s: HoldemPlaying): HoldemPlaying | HoldemIdle {
  if (s.street === "river") {
    return resolveShowdown(s);
  }
  const deck = [...s.deck];
  const board = [...s.board];
  let street: Street = s.street;
  if (s.street === "preflop") {
    for (let i = 0; i < 3; i++) {
      const c = deck.pop();
      if (c) board.push(c);
    }
    street = "flop";
  } else if (s.street === "flop") {
    const c = deck.pop();
    if (c) board.push(c);
    street = "turn";
  } else {
    const c = deck.pop();
    if (c) board.push(c);
    street = "river";
  }
  const bb = bbIdx(s.buttonHero);
  const sb = sbIdx(s.buttonHero);
  return {
    ...s,
    deck,
    board,
    street,
    heroStreetBet: 0,
    cpuStreetBet: 0,
    lastRaiseSize: BB,
    actOrder: [bb, sb],
    message:
      street === "flop" ? "Flop." : street === "turn" ? "Turn." : "River.",
  };
}

/** After a call that matches, decide queue / advance. */
function afterCallMatched(
  s: HoldemPlaying,
  caller: 0 | 1,
  msg: string,
): HoldemPlaying | HoldemIdle {
  const sb = sbIdx(s.buttonHero);
  const bb = bbIdx(s.buttonHero);
  if (
    s.street === "preflop" &&
    caller === sb &&
    maxStreet(s) === BB &&
    s.heroStreetBet === s.cpuStreetBet
  ) {
    return tryCloseOrAdvance({ ...s, actOrder: [bb], message: msg });
  }
  return tryCloseOrAdvance({ ...s, actOrder: [], message: msg });
}

function tryCloseOrAdvance(s: HoldemPlaying): HoldemPlaying | HoldemIdle {
  if (s.heroStreetBet !== s.cpuStreetBet) return s;
  if (s.actOrder.length > 0) return s;
  return advanceStreet(s);
}

function applyCpuAction(s: HoldemPlaying): HoldemPlaying | HoldemIdle {
  if (s.actOrder?.[0] !== 1) return s;
  const tc = cpuToCall(s);
  const curMax = maxStreet(s);
  const minR = minRaiseTotal(s);
  const choice = cpuPickAction({
    hole: s.cpuHole,
    board: s.board,
    toCall: tc,
    pot: s.pot,
    stack: s.cpuStack,
    minRaiseTotal: minR,
    currentMaxStreet: curMax,
    myStreet: s.cpuStreetBet,
  });

  if (choice === "fold") {
    return awardPotToHero({ ...s, folded: "cpu" });
  }

  if (choice === "check" && tc === 0) {
    const q = s.actOrder.slice(1);
    return tryCloseOrAdvance({ ...s, actOrder: q, message: "CPU checks." });
  }

  if (choice === "raise" && tc === 0) {
    const target = Math.min(minR, s.cpuStack + s.cpuStreetBet);
    const add = target - s.cpuStreetBet;
    if (add <= 0) {
      const q = s.actOrder.slice(1);
      return tryCloseOrAdvance({ ...s, actOrder: q, message: "CPU checks." });
    }
    const paid = payCpu(s, add);
    const inc = target - curMax;
    return {
      ...paid,
      lastRaiseSize: Math.max(BB, inc),
      actOrder: [0],
      message: `CPU raises to ${target}.`,
    };
  }

  if (tc > 0) {
    if (choice === "raise") {
      const target = Math.min(minR, s.cpuStack + s.cpuStreetBet);
      const add = target - s.cpuStreetBet;
      if (add > tc) {
        const paid = payCpu(s, add);
        const inc = target - curMax;
        return {
          ...paid,
          lastRaiseSize: Math.max(BB, inc),
          actOrder: [0],
          message: `CPU raises to ${target}.`,
        };
      }
    }
    const paid = payCpu(s, tc);
    return afterCallMatched(
      { ...paid, actOrder: paid.actOrder.slice(1) },
      1,
      "CPU calls.",
    );
  }

  const q = s.actOrder.slice(1);
  return tryCloseOrAdvance({ ...s, actOrder: q, message: "CPU checks." });
}

export function useHoldem() {
  const [state, setState] = useState<HoldemState>(() => ({
    status: "idle",
    buttonHero: true,
    heroStack: START_STACK,
    cpuStack: START_STACK,
    message: "Heads-up vs CPU. Blinds 10 / 20. Deal to start.",
  }));

  const deal = useCallback(() => {
    setState((prev) => {
      if (prev.status !== "idle") return prev;
      if (prev.heroStack < BB || prev.cpuStack < BB) {
        return { ...prev, message: "Not enough chips for both blinds." };
      }
      const deck = shuffle(createDeck());
      const a = deck.pop()!;
      const b = deck.pop()!;
      const c = deck.pop()!;
      const d = deck.pop()!;
      const buttonHero = prev.buttonHero;
      const heroHole: Card[] = sbIdx(buttonHero) === 0 ? [a, b] : [c, d];
      const cpuHole: Card[] = sbIdx(buttonHero) === 0 ? [c, d] : [a, b];
      let heroStack = prev.heroStack;
      let cpuStack = prev.cpuStack;
      let heroStreetBet = 0;
      let cpuStreetBet = 0;
      if (buttonHero) {
        heroStack -= SB;
        cpuStack -= BB;
        heroStreetBet = SB;
        cpuStreetBet = BB;
      } else {
        cpuStack -= SB;
        heroStack -= BB;
        cpuStreetBet = SB;
        heroStreetBet = BB;
      }
      return {
        status: "playing",
        buttonHero,
        heroStack,
        cpuStack,
        pot: SB + BB,
        deck,
        heroHole,
        cpuHole,
        board: [],
        street: "preflop",
        heroStreetBet,
        cpuStreetBet,
        actOrder: [sbIdx(buttonHero)],
        folded: null,
        lastRaiseSize: BB,
        message:
          sbIdx(buttonHero) === 0
            ? "Preflop — your action."
            : "Preflop — CPU acts first.",
      } satisfies HoldemPlaying;
    });
  }, []);

  const heroFold = useCallback(() => {
    setState((prev) => {
      if (prev.status !== "playing" || prev.actOrder?.[0] !== 0) return prev;
      return awardPotToCpu({ ...prev, folded: "hero" });
    });
  }, []);

  const heroCheck = useCallback(() => {
    setState((prev) => {
      if (prev.status !== "playing" || prev.actOrder?.[0] !== 0) return prev;
      if (heroToCall(prev) > 0) return prev;
      const q = prev.actOrder.slice(1);
      return tryCloseOrAdvance({ ...prev, actOrder: q, message: "You check." });
    });
  }, []);

  const heroCall = useCallback(() => {
    setState((prev) => {
      if (prev.status !== "playing" || prev.actOrder?.[0] !== 0) return prev;
      const tc = heroToCall(prev);
      if (tc <= 0) return prev;
      const paid = payHero(prev, tc);
      return afterCallMatched(
        { ...paid, actOrder: paid.actOrder.slice(1) },
        0,
        "You call.",
      );
    });
  }, []);

  const heroRaise = useCallback(() => {
    setState((prev) => {
      if (prev.status !== "playing" || prev.actOrder?.[0] !== 0) return prev;
      const target = minRaiseTotal(prev);
      const add = target - prev.heroStreetBet;
      if (add > prev.heroStack) return prev;
      const curMax = maxStreet(prev);
      const paid = payHero(prev, add);
      const inc = target - curMax;
      return {
        ...paid,
        lastRaiseSize: Math.max(BB, inc),
        actOrder: [1],
        message: `You raise to ${target}.`,
      };
    });
  }, []);

  useEffect(() => {
    if (state.status !== "playing") return;
    if (state.actOrder?.[0] !== 1) return;
    let cancelled = false;
    const t = window.setTimeout(() => {
      if (cancelled) return;
      setState((prev) => {
        if (prev.status !== "playing") return prev;
        if (prev.actOrder?.[0] !== 1) return prev;
        return applyCpuAction(prev);
      });
    }, 650);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [
    state.status,
    state.status === "playing" ? state.actOrder?.[0] ?? null : null,
    state.status === "playing" ? state.street : null,
    state.status === "playing" ? state.heroStreetBet : null,
    state.status === "playing" ? state.cpuStreetBet : null,
    state.status === "playing" ? state.board.length : null,
  ]);

  const isHeroTurn =
    state.status === "playing" && state.actOrder?.[0] === 0;

  const htc = state.status === "playing" ? heroToCall(state) : 0;
  const canCheck = isHeroTurn && htc === 0;
  const canCall = isHeroTurn && htc > 0 && state.heroStack >= htc;
  const canRaise =
    isHeroTurn &&
    state.heroStack + state.heroStreetBet >= minRaiseTotal(state) &&
    minRaiseTotal(state) > maxStreet(state);

  return {
    state,
    deal,
    heroFold,
    heroCheck,
    heroCall,
    heroRaise,
    isHeroTurn,
    heroToCall: htc,
    canCheck,
    canCall,
    canRaise,
    minRaiseTotal: state.status === "playing" ? minRaiseTotal(state) : BB,
    pot: state.status === "playing" ? state.pot : 0,
  };
}

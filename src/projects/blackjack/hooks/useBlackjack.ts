import { useCallback, useState } from "react";
import {
  createDeck,
  dealerUpNeedsPeek,
  handTotal,
  isBust,
  isNaturalBlackjack,
  shuffle,
  type Card,
} from "@/projects/card_games/lib/cards";
import { dealerDraws, settleRegular } from "../lib/engine";

type Phase = "pick" | "play" | "dealer" | "done";

const MIN_BET = 5;
const MAX_BET = 500;

function dealFrom(shoe: Card[]): {
  shoe: Card[];
  player: Card[];
  dealer: Card[];
} {
  const s = [...shoe];
  const player: Card[] = [];
  const dealer: Card[] = [];
  player.push(s.pop()!);
  dealer.push(s.pop()!);
  player.push(s.pop()!);
  dealer.push(s.pop()!);
  return { shoe: s, player, dealer };
}

export function useBlackjack() {
  const [phase, setPhase] = useState<Phase>("pick");
  const [bankroll, setBankroll] = useState(1000);
  const [betUnit, setBetUnit] = useState(25);
  const [wager, setWager] = useState(0);
  const [shoe, setShoe] = useState<Card[]>([]);
  const [player, setPlayer] = useState<Card[]>([]);
  const [dealer, setDealer] = useState<Card[]>([]);
  const [hideHole, setHideHole] = useState(true);
  const [doubled, setDoubled] = useState(false);
  const [status, setStatus] = useState("Choose a stake, then deal.");

  const adjustBet = useCallback(
    (delta: number) => {
      if (phase !== "pick" && phase !== "done") return;
      setBetUnit((b) =>
        Math.min(MAX_BET, Math.max(MIN_BET, b + delta)),
      );
    },
    [phase],
  );

  const deal = useCallback(() => {
    if (phase !== "pick" && phase !== "done") return;
    if (bankroll < betUnit) {
      setStatus("Not enough chips for that bet.");
      return;
    }
    setBankroll((br) => br - betUnit);
    setWager(betUnit);
    setDoubled(false);
    const fresh = shuffle(createDeck());
    const { shoe: s, player: p, dealer: d } = dealFrom(fresh);
    setShoe(s);
    setPlayer(p);
    setDealer(d);
    setHideHole(true);

    const pBJ = isNaturalBlackjack(p);
    const dBJ = isNaturalBlackjack(d);
    const up = d[0]!;

    if (pBJ) {
      if (dealerUpNeedsPeek(up)) {
        setHideHole(false);
        if (dBJ) {
          setBankroll((br) => br + betUnit);
          setStatus("Both blackjack — push.");
        } else {
          const win = betUnit + Math.floor((betUnit * 3) / 2);
          setBankroll((br) => br + win);
          setStatus("Blackjack! You win 3:2.");
        }
      } else {
        setHideHole(false);
        const win = betUnit + Math.floor((betUnit * 3) / 2);
        setBankroll((br) => br + win);
        setStatus("Blackjack! You win 3:2.");
      }
      setPhase("done");
      return;
    }

    if (dealerUpNeedsPeek(up) && dBJ) {
      setHideHole(false);
      setStatus("Dealer blackjack.");
      setPhase("done");
      return;
    }

    setStatus("Hit, stand, or double.");
    setPhase("play");
  }, [phase, bankroll, betUnit]);

  const hit = useCallback(() => {
    if (phase !== "play") return;
    const s = [...shoe];
    const c = s.pop();
    if (!c) return;
    const next = [...player, c];
    setShoe(s);
    setPlayer(next);
    if (isBust(next)) {
      setHideHole(false);
      setStatus("Bust — house wins.");
      setPhase("done");
    }
  }, [phase, shoe, player]);

  const finishHand = useCallback(
    (dFinal: Card[], s: Card[]) => {
      setDealer(dFinal);
      setShoe(s);
      setHideHole(false);
      const { delta, message } = settleRegular(player, dFinal, wager);
      setBankroll((br) => br + delta);
      setStatus(message);
      setPhase("done");
    },
    [player, wager],
  );

  const stand = useCallback(() => {
    if (phase !== "play") return;
    setPhase("dealer");
    const { shoe: s, dealer: dFinal } = dealerDraws(shoe, dealer);
    finishHand(dFinal, s);
  }, [phase, shoe, dealer, finishHand]);

  const double = useCallback(() => {
    if (phase !== "play" || player.length !== 2 || doubled) return;
    const stake = wager;
    if (bankroll < stake) {
      setStatus("Not enough chips to double.");
      return;
    }
    const totalRisk = stake * 2;
    setBankroll((br) => br - stake);
    setWager(totalRisk);
    setDoubled(true);
    const s = [...shoe];
    const c = s.pop();
    if (!c) return;
    const next = [...player, c];
    setShoe(s);
    setPlayer(next);
    if (isBust(next)) {
      setHideHole(false);
      setStatus("Bust — house wins.");
      setPhase("done");
      return;
    }
    setPhase("dealer");
    const { shoe: s2, dealer: dFinal } = dealerDraws(s, dealer);
    setDealer(dFinal);
    setShoe(s2);
    setHideHole(false);
    const { delta, message } = settleRegular(next, dFinal, totalRisk);
    setBankroll((br) => br + delta);
    setStatus(message);
    setPhase("done");
  }, [phase, player, doubled, bankroll, wager, shoe, dealer]);

  const newHand = useCallback(() => {
    setPhase("pick");
    setPlayer([]);
    setDealer([]);
    setShoe([]);
    setWager(0);
    setDoubled(false);
    setHideHole(true);
    setStatus("Choose a stake, then deal.");
  }, []);

  return {
    phase,
    bankroll,
    betUnit,
    wager,
    player,
    dealer,
    hideHole,
    doubled,
    status,
    handTotal: handTotal(player),
    dealerVisibleTotal: hideHole ? handTotal(dealer.slice(0, 1)) : handTotal(dealer),
    adjustBet,
    deal,
    hit,
    stand,
    double,
    newHand,
    minBet: MIN_BET,
    maxBet: MAX_BET,
    canDouble:
      phase === "play" &&
      player.length === 2 &&
      !doubled &&
      bankroll >= wager,
  };
}

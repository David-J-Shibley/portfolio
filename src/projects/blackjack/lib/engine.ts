import { handTotal, isBust } from "@/projects/card_games/lib/cards";

export function dealerDraws(
  shoe: Card[],
  dealer: Card[],
): { shoe: Card[]; dealer: Card[] } {
  const d = [...dealer];
  const s = [...shoe];
  while (handTotal(d) < 17) {
    const c = s.pop();
    if (!c) break;
    d.push(c);
  }
  return { shoe: s, dealer: d };
}

export function settleRegular(
  player: Card[],
  dealer: Card[],
  wager: number,
): { delta: number; message: string } {
  const pt = handTotal(player);
  const dt = handTotal(dealer);
  if (isBust(player)) {
    return { delta: 0, message: "Bust — house wins." };
  }
  if (isBust(dealer)) {
    return { delta: wager * 2, message: "Dealer busts — you win!" };
  }
  if (pt > dt) {
    return { delta: wager * 2, message: "You win." };
  }
  if (pt < dt) {
    return { delta: 0, message: "House wins." };
  }
  return { delta: wager, message: "Push." };
}

import { GameState, playCard, buyCard, moveToBuyPhase, endTurn } from './gameLogic';
import { Card, SupplyPile } from './cards';

// Scoring for AI decision making
interface CardScore {
  card: Card;
  score: number;
}

// AI delay constants
const THINKING_DELAY = 800; // Base delay between moves
const VARIATION = 500; // Random variation to make AI feel more natural

// Make all AI decisions for a turn
export const executeAiTurn = (gameState: GameState): void => {
  if (!gameState.players[gameState.currentPlayerIndex].isBot) {
    return;
  }
  
  // Add a delay to make the AI feel more natural
  gameState.lastAiMoveTimestamp = Date.now();
  
  // AI action phase
  aiActionPhase(gameState);
  
  // AI buy phase
  aiBuyPhase(gameState);
  
  // End turn
  endTurn(gameState);
};

// AI logic for playing action cards
const aiActionPhase = (gameState: GameState): void => {
  const player = gameState.players[gameState.currentPlayerIndex];
  
  // While we have actions and action cards, play the best one
  while (player.actions > 0) {
    const actionCards = player.hand
      .map((card, index) => ({ card, index }))
      .filter(({ card }) => card.type === 'Action');
    
    if (actionCards.length === 0) break;
    
    // Score each action card
    const scoredCards = actionCards.map(({ card, index }) => ({
      card,
      index,
      score: scoreActionCard(card, gameState)
    }));
    
    // Sort by score (highest first)
    scoredCards.sort((a, b) => b.score - a.score);
    
    // Play the best card
    playCard(gameState, player.id, scoredCards[0].index);
  }
  
  // Move to buy phase
  moveToBuyPhase(gameState);
};

// AI logic for buying cards
const aiBuyPhase = (gameState: GameState): void => {
  const player = gameState.players[gameState.currentPlayerIndex];
  
  // While we have buys, buy the best card we can afford
  while (player.buys > 0 && player.coins > 0) {
    const affordablePiles = gameState.supply
      .map((pile, index) => ({ pile, index }))
      .filter(({ pile }) => pile.count > 0 && pile.card.cost <= player.coins);
    
    if (affordablePiles.length === 0) break;
    
    // Score each card we can buy
    const scoredPiles = affordablePiles.map(({ pile, index }) => ({
      pile,
      index,
      score: scoreBuyCard(pile, player.coins, gameState)
    }));
    
    // Sort by score (highest first)
    scoredPiles.sort((a, b) => b.score - a.score);
    
    // If best score is very low, maybe don't buy anything
    if (scoredPiles[0].score < 1 && Math.random() > 0.7) {
      break;
    }
    
    // Buy the best card
    buyCard(gameState, player.id, scoredPiles[0].index);
  }
};

// Score an action card for AI decision making
const scoreActionCard = (card: Card, gameState: GameState): number => {
  let score = 0;
  
  // Cards that draw are very valuable
  if (card.cards) {
    score += card.cards * 3;
  }
  
  // Actions are good
  if (card.actions) {
    score += card.actions * 2;
  }
  
  // Buys are good
  if (card.buys) {
    score += card.buys * 2;
  }
  
  // Coins are good
  if (card.coins) {
    score += card.coins * 1.5;
  }
  
  // Card-specific adjustments based on game state
  if (card.id === 'chapel' && gameState.turnNumber < 5) {
    // Chapel is much better in early game
    score += 5;
  }
  
  if (card.id === 'witch') {
    // More players = more value from Witch
    score += (gameState.players.length - 1) * 2;
  }
  
  return score;
};

// Score a card for buying
const scoreBuyCard = (pile: SupplyPile, availableCoins: number, gameState: GameState): number => {
  const card = pile.card;
  let score = 0;
  if (card.id === 'curse' || card.id === 'copper') {
    return -9999; // Never buy a Curse or Copper
  }

  if (card.type === 'Action') {
    const count = countCardInDeck(gameState, card.id);
    if (count >= 2) score -= count * 2; // Stronger penalty for too many of the same action
  }
  
  // Early game strategy (turns 1-5)
  if (gameState.turnNumber <= 5) {
    // Prioritize economy and deck thinning early
    if (card.id === 'silver') score += 8;
    if (card.id === 'chapel') score += 9;
    if (card.id === 'cellar') score += 6;
    if (card.id === 'village' && countCardTypeInDeck(gameState, 'Action') >= 3) score += 7;
  
    // Deprioritize victory cards early
    if (card.type === 'Victory') score -= 5;
  }
  // Mid game strategy (turns 6-13)
  else if (gameState.turnNumber <= 13) {
    if (card.id === 'gold') score += 9;
    if (card.id === 'silver') score += 6;
    if (card.id === 'village') score += 6;
    if (card.id === 'smithy') score += 7;
    if (card.id === 'market') score += 8;
    if (card.id === 'laboratory') score += 8;
    
    // Start considering victory cards in mid-game
    if (card.id === 'duchy') score += 3;
  }
  // Late game strategy (turn 14+)
  else {
    // In late game, prioritize victory cards
    if (card.id === 'province') score += 15;
    if (card.id === 'duchy') score += 10;
    if (card.id === 'estate' && gameState.turnNumber >= 18) score += 5;
    
    // Still need economy cards
    if (card.id === 'gold') score += 7;
    if (card.id === 'silver') score += 4;
    
    // Actions are less valuable late game
    if (card.type === 'Action') score -= 2;
  }
  
  // Common scoring factors regardless of game stage
  
  // Points per cost ratio for victory cards
  if (card.type === 'Victory' && card.value) {
    score += (card.value / card.cost) * 5;
  }
  
  // Treasure value per cost ratio
  if (card.type === 'Treasure' && card.value) {
    score += (card.value / card.cost) * 5;
  }
  
  // Action cards general scoring
  if (card.type === 'Action') {
    if (card.cards) score += card.cards * 2;
    if (card.actions) score += card.actions;
    if (card.buys) score += card.buys;
    if (card.coins) score += card.coins;
  }
  
  // Adjust score based on what we can afford
  // If we can afford a gold, maybe don't buy a silver
  if (card.id === 'silver' && availableCoins >= 6) score -= 3;
  
  // Avoid buying duplicate action cards too much
  if (card.type === 'Action') {
    const count = countCardInDeck(gameState, card.id);
    if (count >= 2) score -= count;
  }

  if (card.id === 'estate' && gameState.turnNumber >= 18) {
    if (gameState.players[gameState.currentPlayerIndex].coins < 2) {
      score += 2; // Only buy Estate as a last resort if you can't afford anything else
    } else {
      score -= 5; // Otherwise, avoid it
    }
  }
  
  // Random factor to make AI less predictable
  score += Math.random() * 2 - 1;
  console.log('Scored card: ', score, card)
  return score;
};

// Helper to count cards in AI's deck
const countCardInDeck = (gameState: GameState, cardId: string): number => {
  const player = gameState.players[gameState.currentPlayerIndex];
  const allCards = [...player.deck, ...player.hand, ...player.discard, ...player.playArea];
  
  return allCards.filter(card => card.id === cardId).length;
};

// Helper to count card types in AI's deck
const countCardTypeInDeck = (gameState: GameState, cardType: string): number => {
  const player = gameState.players[gameState.currentPlayerIndex];
  const allCards = [...player.deck, ...player.hand, ...player.discard, ...player.playArea];
  
  return allCards.filter(card => card.type === cardType).length;
};

// Check if it's time for the AI to make a move
export const shouldAiMove = (gameState: GameState): boolean => {
  if (!gameState.players[gameState.currentPlayerIndex].isBot) {
    return false;
  }
  
  // If this is the first AI move or if enough time has passed since the last move
  const now = Date.now();
  return (
    !gameState.lastAiMoveTimestamp || 
    (now - gameState.lastAiMoveTimestamp) > (THINKING_DELAY + Math.random() * VARIATION)
  );
};

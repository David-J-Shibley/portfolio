import { 
  Card, SupplyPile, createInitialDeck, createInitialSupply, getCardById, 
  COPPER, PROVINCE, CURSE 
} from './cards';

export interface Player {
  id: string;
  name: string;
  deck: Card[];
  hand: Card[];
  discard: Card[];
  playArea: Card[];
  actions: number;
  buys: number;
  coins: number;
  isBot?: boolean;
}

export type GamePhase = 'setup' | 'action' | 'buy' | 'cleanup' | 'gameOver';

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  supply: SupplyPile[];
  trash: Card[];
  phase: GamePhase;
  log: string[];
  turnNumber: number;
  selectedCard: Card | null;
  selectedPile: SupplyPile | null;
  isSelecting: boolean;
  selectionType: 'hand' | 'supply' | 'none';
  selectionMessage: string;
  gameOver: boolean;
  lastAiMoveTimestamp?: number;
}

// Shuffle function
export const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Initialize game
export const initializeGame = (playerName: string, withBot: boolean): GameState => {
  const players: Player[] = [
    {
      id: 'player1',
      name: playerName,
      deck: shuffle(createInitialDeck()),
      hand: [],
      discard: [],
      playArea: [],
      actions: 0,
      buys: 0,
      coins: 0,
    }
  ];

  if (withBot) {
    players.push({
      id: 'player2',
      name: 'Bot',
      deck: shuffle(createInitialDeck()),
      hand: [],
      discard: [],
      playArea: [],
      actions: 0,
      buys: 0,
      coins: 0,
      isBot: true,
    });
  }

  const gameState: GameState = {
    players,
    currentPlayerIndex: 0,
    supply: createInitialSupply(players.length),
    trash: [],
    phase: 'setup',
    log: ['Game started'],
    turnNumber: 1,
    selectedCard: null,
    selectedPile: null,
    isSelecting: false,
    selectionType: 'none',
    selectionMessage: '',
    gameOver: false,
  };

  for (const player of gameState.players) {
    drawCards(gameState, player.id, 5);
  }

  gameState.phase = 'action';
  gameState.players[0].actions = 1;
  gameState.players[0].buys = 1;

  gameState.log.push(`${players[0].name}'s turn 1`);

  return gameState;
};

// Draw cards function
export const drawCards = (gameState: GameState, playerId: string, count: number): void => {
  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return;

  for (let i = 0; i < count; i++) {
    if (player.deck.length === 0) {
      if (player.discard.length === 0) return;
      player.deck = shuffle(player.discard);
      player.discard = [];
      gameState.log.push(`${player.name} shuffled their discard pile`);
    }

    const card = player.deck.pop()!;
    player.hand.push(card);
  }
};

// Play a card
export const playCard = (gameState: GameState, playerId: string, cardIndex: number): void => {
  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return;

  if (cardIndex < 0 || cardIndex >= player.hand.length) return;

  const card = player.hand.splice(cardIndex, 1)[0];
  player.playArea.push(card);
  gameState.log.push(`${player.name} played ${card.name}`);

  if (card.type === 'Action') {
    player.actions--;

    if (card.cards) drawCards(gameState, player.id, card.cards);
    if (card.actions) player.actions += card.actions;
    if (card.buys) player.buys += card.buys;
    if (card.coins) player.coins += card.coins;

    if (card.effects) handleSpecialEffects(gameState, player.id, card.effects);
  } else if (card.type === 'Treasure') {
    if (card.value) player.coins += card.value;
  }
};

// Handle special effects
export const handleSpecialEffects = (gameState: GameState, playerId: string, effects: string[]): void => {
  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return;

  for (const effect of effects) {
    if (effect === 'discardAndDraw') {
      gameState.isSelecting = true;
      gameState.selectionType = 'hand';
      gameState.selectionMessage = 'Select cards to discard, then click "Done"';
    } else if (effect.startsWith('forceDiscard')) {
      const tax = parseInt(effect.split(':')[1])
      for (const otherPlayer of gameState.players) {
        if (otherPlayer.id !== player.id) {
          otherPlayer.coins -= tax
        }
      }
    } else if (effect.startsWith('trashFromHand:')) {
      const limit = parseInt(effect.split(':')[1]);
      gameState.isSelecting = true;
      gameState.selectionType = 'hand';
      gameState.selectionMessage = `Select up to ${limit} cards to trash, then click "Done"`;
    } else if (effect.startsWith('giveOthersCard:')) {
      const cardId = effect.split(':')[1];
      const card = getCardById(cardId);
      if (card) {
        for (const otherPlayer of gameState.players) {
          if (otherPlayer.id !== player.id) {
            const cursePile = gameState.supply.find(pile => pile.card.id === cardId);
            if (cursePile && cursePile.count > 0) {
              otherPlayer.discard.push(card);
              cursePile.count--;
              gameState.log.push(`${otherPlayer.name} gained a ${card.name}`);
            }
          }
        }
      }
    }
  }
};

// Buy a card
export const buyCard = (gameState: GameState, playerId: string, supplyIndex: number): void => {
  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return;

  const pile = gameState.supply[supplyIndex];

  if (pile.count <= 0 || player.coins < pile.card.cost || player.buys <= 0) return;

  player.buys--;
  player.coins -= pile.card.cost;
  player.discard.push(pile.card);
  pile.count--;

  gameState.log.push(`${player.name} bought ${pile.card.name}`);

  checkGameEnd(gameState);
};

// End turn
export const endTurn = (gameState: GameState): void => {
  const player = gameState.players[gameState.currentPlayerIndex];

  player.discard.push(...player.playArea, ...player.hand);
  player.playArea = [];
  player.hand = [];

  drawCards(gameState, player.id, 5);

  gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
  if (gameState.currentPlayerIndex === 0) gameState.turnNumber++;

  const nextPlayer = gameState.players[gameState.currentPlayerIndex];
  nextPlayer.actions = 1;
  nextPlayer.buys = 1;
  nextPlayer.coins = 0;

  gameState.phase = 'action';
  gameState.log.push(`${nextPlayer.name}'s turn ${gameState.turnNumber}`);

  checkGameEnd(gameState);
};

// Check game end
export const checkGameEnd = (gameState: GameState): boolean => {
  return gameState.supply.some(pile => pile.card.id === PROVINCE.id && pile.count === 0) ||
    gameState.supply.filter(pile => pile.count === 0).length >= 3;
};

export const calculateVictoryPoints = (player: Player): number => {
  const allCards = [...player.deck, ...player.hand, ...player.discard, ...player.playArea];
  return allCards.reduce((total, card) => {
    if (card.type === 'Victory' || card.type === 'Curse') {
      return total + (card.value || 0);
    }
    return total;
  }, 0);
};

export const getCurrentPlayer = (gameState: GameState): Player => {
  return gameState.players[gameState.currentPlayerIndex];
};

export const isCardPlayable = (gameState: GameState, card: Card): boolean => {
  if (gameState.phase === 'action') {
    return card.type === 'Action' && getCurrentPlayer(gameState).actions > 0;
  } else if (gameState.phase === 'buy') {
    return card.type === 'Treasure';
  }
  return false;
};

// Check if a card is buyable
export const isCardBuyable = (gameState: GameState, pile: SupplyPile): boolean => {
  const player = getCurrentPlayer(gameState);
  return (
    gameState.phase === 'buy' &&
    player.buys > 0 &&
    player.coins >= pile.card.cost &&
    pile.count > 0
  );
};

// Move to the buy phase
export const moveToBuyPhase = (gameState: GameState): void => {
  gameState.phase = 'buy';
  
  // Play all treasures automatically
  const player = gameState.players[gameState.currentPlayerIndex];
  const treasureIndices: number[] = [];
  
  player.hand.forEach((card, index) => {
    if (card.type === 'Treasure') {
      treasureIndices.push(index);
    }
  });
  
  // Need to play them in reverse order so indices stay valid
  treasureIndices.reverse().forEach(index => {
    playCard(gameState, player.id, index);
  });
  
  gameState.log.push(`Buy phase started, ${player.coins} coins available`);
};
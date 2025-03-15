// Card types
export type CardType = 'Treasure' | 'Victory' | 'Action' | 'Curse';

export interface Card {
  id: string;
  name: string;
  type: CardType; 
  cost: number;
  description: string;
  image?: string;
  value?: number; // For treasures (coins) and victory cards (points)
  actions?: number; // Additional actions granted
  cards?: number; // Cards to draw
  buys?: number; // Additional buys granted
  coins?: number; // Temporary coins for the turn
  effects?: string[]; // Special effects
  url?: string;
}

// Core Cards
export const COPPER: Card = {
  id: 'copper',
  name: 'Copper',
  type: 'Treasure',
  cost: 0,
  description: 'Worth 1 coin',
  value: 1,
  url: 'https://wiki.dominionstrategy.com/images/thumb/f/fb/Copper.jpg/1200px-Copper.jpg',
};

export const SILVER: Card = {
  id: 'silver',
  name: 'Silver',
  type: 'Treasure',
  cost: 3,
  description: 'Worth 2 coins',
  value: 2,
  url: 'https://wiki.dominionstrategy.com/images/thumb/5/5d/Silver.jpg/800px-Silver.jpg',
};

export const GOLD: Card = {
  id: 'gold',
  name: 'Gold',
  type: 'Treasure',
  cost: 6,
  description: 'Worth 3 coins',
  value: 3,
  url: 'https://wiki.dominionstrategy.com/images/thumb/5/50/Gold.jpg/1200px-Gold.jpg'
};

export const ESTATE: Card = {
  id: 'estate',
  name: 'Estate',
  type: 'Victory',
  cost: 2,
  description: 'Worth 1 victory point',
  value: 1,
  url: 'https://wiki.dominionstrategy.com/images/thumb/9/91/Estate.jpg/640px-Estate.jpg'
};

export const DUCHY: Card = {
  id: 'duchy',
  name: 'Duchy',
  type: 'Victory',
  cost: 5,
  description: 'Worth 3 victory points',
  value: 3,
  url: 'https://wiki.dominionstrategy.com/images/thumb/4/4a/Duchy.jpg/1200px-Duchy.jpg'
};

export const PROVINCE: Card = {
  id: 'province',
  name: 'Province',
  type: 'Victory',
  cost: 8,
  description: 'Worth 6 victory points',
  value: 6,
  url: 'https://wiki.dominionstrategy.com/images/thumb/8/81/Province.jpg/1200px-Province.jpg'
};

export const CURSE: Card = {
  id: 'curse',
  name: 'Curse',
  type: 'Curse',
  cost: 0,
  description: 'Worth -1 victory point',
  value: -1,
  url: 'https://wiki.dominionstrategy.com/images/thumb/9/97/Curse.jpg/1200px-Curse.jpg'
}

// Kingdom Cards
export const VILLAGE: Card = {
  id: 'village',
  name: 'Village',
  type: 'Action',
  cost: 3,
  description: '+1 Card, +2 Actions',
  cards: 1,
  actions: 2,
  url: 'https://wiki.dominionstrategy.com/images/thumb/5/5a/Village.jpg/640px-Village.jpg'
};

export const SMITHY: Card = {
  id: 'smithy',
  name: 'Smithy',
  type: 'Action',
  cost: 4,
  description: '+3 Cards',
  cards: 3,
  url: 'https://wiki.dominionstrategy.com/images/thumb/3/36/Smithy.jpg/1200px-Smithy.jpg'
};

export const MARKET: Card = {
  id: 'market',
  name: 'Market',
  type: 'Action',
  cost: 5,
  description: '+1 Card, +1 Action, +1 Buy, +1 Coin',
  cards: 1,
  actions: 1,
  buys: 1,
  coins: 1,
  url: 'https://wiki.dominionstrategy.com/images/thumb/7/7e/Market.jpg/1200px-Market.jpg'
};

export const FESTIVAL: Card = {
  id: 'festival',
  name: 'Festival',
  type: 'Action',
  cost: 5,
  description: '+2 Actions, +1 Buy, +2 Coins',
  actions: 2,
  buys: 1,
  coins: 2,
  url: 'https://wiki.dominionstrategy.com/images/thumb/e/ec/Festival.jpg/800px-Festival.jpg'
};

export const LABORATORY: Card = {
  id: 'laboratory',
  name: 'Laboratory',
  type: 'Action',
  cost: 5,
  description: '+2 Cards, +1 Action',
  cards: 2,
  actions: 1,
  url: 'https://wiki.dominionstrategy.com/images/thumb/0/0c/Laboratory.jpg/1200px-Laboratory.jpg'
};

export const WITCH: Card = {
  id: 'witch',
  name: 'Witch',
  type: 'Action',
  cost: 5,
  description: '+2 Cards. Each other player gains a Curse card.',
  cards: 2,
  effects: ['giveOthersCard:curse'],
  url: 'https://wiki.dominionstrategy.com/images/thumb/f/f3/Witch.jpg/1200px-Witch.jpg'
};

export const CHAPEL: Card = {
  id: 'chapel',
  name: 'Chapel',
  type: 'Action',
  cost: 2,
  description: 'Trash up to 4 cards from your hand.',
  effects: ['trashFromHand:4'],
  url: 'https://wiki.dominionstrategy.com/images/thumb/2/29/Chapel.jpg/1200px-Chapel.jpg'
};

export const CELLAR: Card = {
  id: 'cellar',
  name: 'Cellar',
  type: 'Action',
  cost: 2,
  description: '+1 Action. Discard any number of cards, then draw that many.',
  actions: 1,
  effects: ['discardAndDraw'],
  url: 'https://wiki.dominionstrategy.com/images/thumb/1/1c/Cellar.jpg/1200px-Cellar.jpg'
};

export const MOAT: Card = {
  id: 'moat',
  name: 'Moat',
  type: 'Action',
  cost: 2,
  description: '+2 Cards. When another player plays an Attack card, you may reveal this from your hand to be unaffected by it.',
  cards: 2,
  effects: ['reaction:attack'],
  url: 'https://wiki.dominionstrategy.com/images/thumb/f/fe/Moat.jpg/1200px-Moat.jpg'
};

export const REMODEL: Card = {
  id: 'remodel',
  name: 'Remodel',
  type: 'Action',
  cost: 4,
  description: 'Trash a card from your hand. Gain a card costing up to 2 more than it.',
  effects: ['trashAndGain:2'],
  url: 'https://wiki.dominionstrategy.com/images/thumb/2/2e/Remodel.jpg/1200px-Remodel.jpg'
};

// export const MILITIA: Card = {
//   id: 'militia',
//   name: 'Militia',
//   type: 'Action',
//   cost: 4,
//   description: '+2 Coins. Each other player discards down to 3 cards in hand.',
//   coins: 2,
//   effects: ['attack:discardDownTo:3'],
// };

// export const MINE: Card = {
//   id: 'mine',
//   name: 'Mine',
//   type: 'Action',
//   cost: 5,
//   description: 'Trash a Treasure card from your hand. Gain a Treasure costing up to 3 more.',
//   effects: ['trashTreasureAndGain:3'],
// };

// export const THRONE_ROOM: Card = {
//   id: 'throne_room',
//   name: 'Throne Room',
//   type: 'Action',
//   cost: 4,
//   description: 'Choose an Action card in your hand. Play it twice.',
//   effects: ['doubleAction'],
// };

// export const WORKSHOP: Card = {
//   id: 'workshop',
//   name: 'Workshop',
//   type: 'Action',
//   cost: 3,
//   description: 'Gain a card costing up to 4 coins.',
//   effects: ['gainCard:4'],
// };

// export const GARDENS: Card = {
//   id: 'gardens',
//   type: 'Victory',
//   name: 'Gardens',
//   cost: 4,
//   description: 'Worth 1 Victory point per 10 cards in your deck (rounded down).',
//   effects: ['variablePoints:deckSize'],
// };

// export const BUREAUCRAT: Card = {
//   id: 'bureaucrat',
//   name: 'Bureaucrat',
//   type: 'Action',
//   cost: 4,
//   description: 'Gain a Silver onto your deck. Each other player puts a Victory card from their hand onto their deck.',
//   effects: ['gainSilverOnDeck', 'attack:topDeckVictory'],
// };

// export const SPY: Card = {
//   id: 'spy',
//   name: 'Spy',
//   type: 'Action',
//   cost: 4,
//   description: '+1 Card, +1 Action. Each player (including you) reveals the top card of their deck and discards it or puts it back.',
//   cards: 1,
//   actions: 1,
//   effects: ['revealAndDiscardOrTopDeck'],
// };

// export const THIEF: Card = {
//   id: 'thief',
//   name: 'Thief',
//   type: 'Action',
//   cost: 4,
//   description: 'Each other player reveals the top 2 cards of their deck. You may trash a revealed Treasure and gain it.',
//   effects: ['attack:stealTreasure'],
// };

// export const LIBRARY: Card = {
//   id: 'library',
//   name: 'Library',
//   type: 'Action',
//   cost: 5,
//   description: 'Draw until you have 7 cards in hand. You may set aside any Action cards drawn this way.',
//   effects: ['drawUntil:7', 'setAsideActions'],
// };

// export const ADVENTURER: Card = {
//   id: 'adventurer',
//   name: 'Adventurer',
//   type: 'Action',
//   cost: 6,
//   description: 'Reveal cards from your deck until you reveal 2 Treasure cards. Put them into your hand and discard the rest.',
//   effects: ['revealUntilTreasure:2'],
// };

export const BLACKSMITH: Card = {
  name: "Blacksmith",
  id: 'blacksmith',
  description: 'Draw 3 cards',
  cost: 4,
  type: "Action",
  cards: 3,
  url: 'https://wiki.dominionstrategy.com/images/thumb/e/eb/Blacksmith.jpg/1200px-Blacksmith.jpg'
}

// export const TAX_COLLECTOR: Card = {
//   name: "Tax Collector",
//   id: 'tax_collector',
//   description: 'Force the other player to discard 1 card and plus 2 coins',
//   cost: 5,
//   type: "Action",
//   coins: 2,
//   effects: ['forceDiscard:1', 'taxCollector']
// }

// All kingdom cards for selection
export const KINGDOM_CARDS = [
  VILLAGE, SMITHY, MARKET, FESTIVAL, LABORATORY, 
  WITCH, CHAPEL, CELLAR, MOAT, REMODEL, BLACKSMITH
];

// All cards
export const ALL_CARDS = [
  COPPER, SILVER, GOLD, 
  ESTATE, DUCHY, PROVINCE, CURSE,
  ...KINGDOM_CARDS
];

// Find a card by ID
export const getCardById = (id: string): Card | undefined => {
  return ALL_CARDS.find(card => card.id === id);
};

// Create initial deck (7 Copper, 3 Estate)
export const createInitialDeck = (): Card[] => {
  return [
    ...Array(7).fill(COPPER),
    ...Array(3).fill(ESTATE)
  ];
};

// Get the color class for a card type
export const getCardColorClass = (type: CardType): string => {
  switch (type) {
    case 'Treasure': return 'bg-treasure';
    case 'Victory': return 'bg-victory';
    case 'Action': return 'bg-action';
    case 'Curse': return 'bg-curse';
    default: return 'bg-muted border-muted';
  }
};

// Create initial supply piles
export interface SupplyPile {
  card: Card;
  count: number;
}

export const createInitialSupply = (playerCount: number = 2): SupplyPile[] => {
  // Base cards
  const baseCards = [
    { card: COPPER, count: 60 - (playerCount * 7) }, // Remove the starting coppers
    { card: SILVER, count: 40 },
    { card: GOLD, count: 30 },
    { card: ESTATE, count: playerCount <= 2 ? 8 : 12 },
    { card: DUCHY, count: playerCount <= 2 ? 8 : 12 },
    { card: PROVINCE, count: playerCount <= 2 ? 8 : 12 },
    { card: CURSE, count: playerCount === 2 ? 10 : (playerCount === 3 ? 20 : 30) },
  ];
  
  // Randomly select 10 kingdom cards
  const shuffled = [...KINGDOM_CARDS].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 10);
  
  const kingdomCards = selected.map(card => ({
    card,
    count: 10
  }));
  
  return [...baseCards, ...kingdomCards];
};

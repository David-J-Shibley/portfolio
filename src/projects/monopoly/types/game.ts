export type PropertyColor = 
  'brown' | 'lightBlue' | 'pink' | 'orange' | 
  'red' | 'yellow' | 'green' | 'darkBlue' | 
  'railroad' | 'utility';

export type PropertyStatus = 'unowned' | 'owned' | 'mortgaged';

export interface Property {
  id: number;
  name: string;
  price: number;
  rent: number[];
  houseCost: number;
  hotelCost: number;
  houses: number;
  color: PropertyColor;
  mortgageValue: number;
  status: PropertyStatus;
  owner: number | null;
  position: number;
}

export type SpaceType = 
  'property' | 'railroad' | 'utility' | 
  'tax' | 'chance' | 'community' | 
  'go' | 'jail' | 'free-parking' | 'go-to-jail';

export interface BoardSpace {
  id: number;
  position: number;
  name: string;
  type: SpaceType;
  propertyId?: number;
  action?: () => void;
}

export interface Card {
  id: number;
  type: 'chance' | 'community';
  text: string;
  action: (playerId: number, gameState: GameState) => GameState;
}

export type PlayerToken = 'car' | 'shoe' | 'hat' | 'dog' | 'ship' | 'iron' | 'thimble' | 'wheelbarrow';

export type PlayerStatus = 'playing' | 'bankrupt' | 'jailed';

export interface Player {
  id: number;
  name: string;
  money: number;
  position: number;
  token: PlayerToken;
  jailTurns: number;
  status: PlayerStatus;
  properties: number[];
  getOutOfJailCards: number;
  isAI: boolean;
}

export interface GameState {
  players: Player[];
  properties: Property[];
  boardSpaces: BoardSpace[];
  chanceCards: Card[];
  communityCards: Card[];
  currentPlayerId: number;
  dice: [number, number];
  doubleRollCount: number;
  gamePhase: 'roll' | 'move' | 'action' | 'end-turn';
  lastRoll: [number, number] | null;
  winner: number | null;
  turnCount: number;
  logs: string[];
}

export interface GameAction {
  type: string;
  payload?: any;
}
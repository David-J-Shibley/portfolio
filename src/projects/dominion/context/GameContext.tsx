import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Card, SupplyPile } from '../utils/cards';
import { GameState, initializeGame, playCard, buyCard, moveToBuyPhase, endTurn, getCurrentPlayer, Player } from '../utils/gameLogic';
import { executeAiTurn, shouldAiMove } from '../utils/ai';

// Action types for reducer
type GameAction = 
  | { type: 'START_GAME'; playerName: string; withBot: boolean }
  | { type: 'PLAY_CARD'; index: number }
  | { type: 'PLAYER', player: Player }
  | { type: 'BUY_CARD'; index: number }
  | { type: 'MOVE_TO_BUY_PHASE' }
  | { type: 'END_TURN' }
  | { type: 'SELECT_CARD'; card: Card }
  | { type: 'SELECT_PILE'; pile: SupplyPile }
  | { type: 'AI_MOVE' };

// Context interface
interface GameContextType {
  state: GameState | null;
  dispatch: React.Dispatch<GameAction>;
  startGame: (playerName: string, withBot: boolean) => void;
  playCardFromHand: (index: number) => void;
  updatePlayer: (player: Player) => void
  buyCardFromSupply: (index: number) => void;
  moveToNextPhase: () => void;
  selectCard: (card: Card) => void;
  selectPile: (pile: SupplyPile) => void;
}

// Initial context state
const initialState: GameState | null = null;

// Create context
const GameContext = createContext<GameContextType>({
  state: initialState,
  dispatch: () => {},
  startGame: () => {},
  playCardFromHand: () => {},
  updatePlayer: () => {},
  buyCardFromSupply: () => {},
  moveToNextPhase: () => {},
  selectCard: () => {},
  selectPile: () => {},
});

// Game reducer
const gameReducer = (state: GameState | null, action: GameAction): GameState | null => {
  if (!state && action.type !== 'START_GAME') return null;

  switch (action.type) {
    case 'START_GAME':
      return initializeGame(action.playerName, action.withBot);

    case 'PLAY_CARD':
      if (!state) return null;
      const currentPlayer = getCurrentPlayer(state);
      if (action.index >= 0 && action.index < currentPlayer.hand.length) {
        const newState = { ...state };
        playCard(newState, currentPlayer.id, action.index);
        return newState;
      }
      return state;

    case 'BUY_CARD':
      if (!state) return null;
      const buyPlayer = getCurrentPlayer(state);
      if (action.index >= 0 && action.index < state.supply.length) {
        const newState = { ...state };
        buyCard(newState, buyPlayer.id, action.index);
        return newState;
      }
      return state;

    case 'MOVE_TO_BUY_PHASE':
      if (!state) return null;
      const newBuyPhaseState = { ...state };
      moveToBuyPhase(newBuyPhaseState);
      return newBuyPhaseState;

    case 'END_TURN':
      if (!state) return null;
      const newEndTurnState = { ...state };
      endTurn(newEndTurnState);
      return newEndTurnState;

    case 'SELECT_CARD':
      if (!state) return null;
      return {
        ...state,
        selectedCard: action.card
      };

    case 'SELECT_PILE':
      if (!state) return null;
      return {
        ...state,
        selectedPile: action.pile
      };

    case 'PLAYER':
      if (!state) return null;
      return {
        ...state,
      }
      
    case 'AI_MOVE':
      if (!state) return null;
      if (state.players[state.currentPlayerIndex].isBot) {
        const newState = { ...state };
        executeAiTurn(newState);
        return newState;
      }
      return state;

    default:
      return state;
  }
};

// Provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // AI move timer
  useEffect(() => {
    if (!state) return;
    
    if (shouldAiMove(state)) {
      const timer = setTimeout(() => {
        dispatch({ type: 'AI_MOVE' });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [state]);

  // Helper functions
  const startGame = (playerName: string, withBot: boolean) => {
    dispatch({ type: 'START_GAME', playerName, withBot });
  };

  const updatePlayer = (player: Player) => {
    dispatch({ type: 'PLAYER', player })
  }

  const playCardFromHand = (index: number) => {
    dispatch({ type: 'PLAY_CARD', index });
  };

  const buyCardFromSupply = (index: number) => {
    dispatch({ type: 'BUY_CARD', index });
  };

  const moveToNextPhase = () => {
    if (state?.phase === 'action') {
      dispatch({ type: 'MOVE_TO_BUY_PHASE' });
    } else if (state?.phase === 'buy') {
      dispatch({ type: 'END_TURN' });
    }
  };

  const selectCard = (card: Card) => {
    dispatch({ type: 'SELECT_CARD', card });
  };

  const selectPile = (pile: SupplyPile) => {
    dispatch({ type: 'SELECT_PILE', pile });
  };

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        startGame,
        playCardFromHand,
        updatePlayer,
        buyCardFromSupply,
        moveToNextPhase,
        selectCard,
        selectPile,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = () => useContext(GameContext);
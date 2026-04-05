import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { BOARD_SPACES, CHANCE_CARDS, COMMUNITY_CARDS, PROPERTIES } from '../data/boardData';
import { GameState, GameAction, Player, PlayerToken, PlayerStatus, PropertyStatus } from '../types/game';
import { useToast } from '@/components/ui/use-toast';

const PLAYER_COLORS = [
  "#e6194b", // red
  "#3cb44b", // green
  "#ffe119", // yellow
  "#4363d8", // blue
  "#f58231", // orange
  "#911eb4", // purple
  "#46f0f0", // cyan
  "#f032e6", // magenta
];

// Shuffle an array (Fisher-Yates algorithm)
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Roll dice function
const rollDice = (): [number, number] => {
  return [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
};

// Initial game state
const initialState: GameState = {
  players: [],
  properties: PROPERTIES,
  boardSpaces: BOARD_SPACES,
  chanceCards: shuffleArray(CHANCE_CARDS),
  communityCards: shuffleArray(COMMUNITY_CARDS),
  currentPlayerId: 0,
  dice: [1, 1],
  doubleRollCount: 0,
  gamePhase: 'roll',
  lastRoll: null,
  winner: null,
  turnCount: 0,
  logs: ['Game started'],
  auctionActive: false,
  auctionPropertyId: null,
  auctionBids: [],
  auctionCurrentBid: 0,
  auctionCurrentBidder: null,
  auctionPassed: [],
};

// Game reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'INITIALIZE_GAME': {
      const { playerName, playerToken, numAiPlayers } = action.payload;
      
      // Available tokens excluding the player's choice
      const tokens: PlayerToken[] = ['car', 'shoe', 'hat', 'dog', 'ship', 'iron', 'thimble', 'wheelbarrow'];
      const availableTokens = tokens.filter(token => token !== playerToken);
      
      // Assign colors
      const colorPool = [...PLAYER_COLORS];
      const humanColor = colorPool.shift()!;
      
      // Create human player
      const humanPlayer: Player = {
        id: 0,
        name: playerName,
        money: 1500,
        position: 0,
        token: playerToken,
        jailTurns: 0,
        status: 'playing',
        properties: [],
        getOutOfJailCards: 0,
        isAI: false,
        color: humanColor,
      };
      
      // Create AI players
      const aiPlayers: Player[] = [];
      for (let i = 0; i < numAiPlayers; i++) {
        const tokenIndex = Math.floor(Math.random() * availableTokens.length);
        const aiToken = availableTokens.splice(tokenIndex, 1)[0];
        const aiColor = colorPool.shift() || "#888";
        
        aiPlayers.push({
          id: i + 1,
          name: `AI ${i + 1}`,
          money: 1500,
          position: 0,
          token: aiToken,
          jailTurns: 0,
          status: 'playing',
          properties: [],
          getOutOfJailCards: 0,
          isAI: true,
          color: aiColor,
        });
      }
      
      return {
        ...state,
        players: [humanPlayer, ...aiPlayers],
        currentPlayerId: 0,
        gamePhase: 'roll',
        logs: ['Game started']
      };
    }
    
    case 'ROLL_DICE': {
      const dice = rollDice();
      const isDouble = dice[0] === dice[1];
      
      // If the current player is in jail
      const currentPlayer = state.players.find(p => p.id === state.currentPlayerId)!;
      if (currentPlayer.status === 'jailed') {
        if (isDouble) {
          // Player gets out of jail on a double
          const updatedPlayers = state.players.map(player => 
            player.id === state.currentPlayerId 
              ? { ...player, jailTurns: 0, status: 'playing' as PlayerStatus }
              : player
          );
          
          return {
            ...state,
            players: updatedPlayers,
            dice,
            lastRoll: dice,
            gamePhase: 'move',
            doubleRollCount: 0,
            logs: [...state.logs, `${currentPlayer.name} rolled a double (${dice[0]}, ${dice[1]}) and got out of jail!`]
          };
        } else {
          // Player stays in jail and loses a turn
          const remainingJailTurns = currentPlayer.jailTurns - 1;
          const updatedPlayers = state.players.map(player => 
            player.id === state.currentPlayerId
              ? { 
                  ...player, 
                  jailTurns: remainingJailTurns,
                  status: remainingJailTurns <= 0 ? 'playing' : 'jailed' as PlayerStatus
                }
              : player
          );
          
          // Find the next player
          const currentPlayerIndex = state.players.findIndex(p => p.id === state.currentPlayerId);
          const nextPlayerIndex = (currentPlayerIndex + 1) % state.players.length;
          const nextPlayerId = state.players[nextPlayerIndex].id;
          
          return {
            ...state,
            players: updatedPlayers,
            dice,
            lastRoll: dice,
            gamePhase: 'roll',
            currentPlayerId: nextPlayerId,
            doubleRollCount: 0,
            logs: [...state.logs, `${currentPlayer.name} rolled (${dice[0]}, ${dice[1]}) and stays in jail. ${remainingJailTurns} turns left in jail.`]
          };
        }
      }
      
      // Regular dice roll for player not in jail
      let doubleRollCount = isDouble ? state.doubleRollCount + 1 : 0;
      
      // Check if player rolled three doubles in a row
      if (doubleRollCount === 3) {
        const updatedPlayers = state.players.map(player => 
          player.id === state.currentPlayerId 
            ? { ...player, position: 10, jailTurns: 3, status: 'jailed' as PlayerStatus }
            : player
        );
        
        return {
          ...state,
          players: updatedPlayers,
          dice,
          lastRoll: dice,
          gamePhase: 'roll',
          doubleRollCount: 0,
          // After going to jail from 3 doubles, the turn passes to the next player
          currentPlayerId: (state.players.findIndex(p => p.id === state.currentPlayerId) + 1) % state.players.length,
          logs: [...state.logs, `${currentPlayer.name} rolled 3 doubles in a row and was sent to jail!`]
        };
      }
      
      return {
        ...state,
        dice,
        lastRoll: dice,
        gamePhase: 'move',
        doubleRollCount,
        logs: [...state.logs, `${currentPlayer.name} rolled ${dice[0]} + ${dice[1]} = ${dice[0] + dice[1]}${isDouble ? ' (doubles)' : ''}`]
      };
    }
    
    case 'MOVE_PLAYER': {
      const { dice } = state;
      const diceSum = dice[0] + dice[1];
      const currentPlayer = state.players.find(p => p.id === state.currentPlayerId)!;
      
      // Calculate new position
      let newPosition = (currentPlayer.position + diceSum) % 40;
      
      // Check if player passes GO
      const passedGo = currentPlayer.position + diceSum >= 40;
      let newMoney = currentPlayer.money;
      if (passedGo) {
        newMoney += 200;
      }
      
      // Update player position and money
      const updatedPlayers = state.players.map(player => 
        player.id === state.currentPlayerId 
          ? { ...player, position: newPosition, money: newMoney }
          : player
      );
      
      // Log messages
      let logs = [...state.logs];
      if (passedGo) {
        logs.push(`${currentPlayer.name} passed GO and collected $200`);
      }
      logs.push(`${currentPlayer.name} moved to ${state.boardSpaces.find(space => space.position === newPosition)?.name}`);
      
      return {
        ...state,
        players: updatedPlayers,
        gamePhase: 'action',
        logs
      };
    }
    
    case 'HANDLE_SPACE_ACTION': {
      const currentPlayer = state.players.find(p => p.id === state.currentPlayerId)!;
      const currentSpace = state.boardSpaces.find(space => space.position === currentPlayer.position)!;
      
      let newState = { ...state };
      let logs = [...state.logs];
      
      switch (currentSpace.type) {
        case 'property':
        case 'railroad':
        case 'utility': {
          const propertyId = currentSpace.propertyId!;
          const property = state.properties.find(p => p.id === propertyId)!;
          
          if (property.status === 'unowned') {
            // If AI player, decide whether to buy based on strategy
            if (currentPlayer.isAI) {
              const aiWillBuy = currentPlayer.money >= property.price * 1.5; // Simple AI logic
              if (aiWillBuy) {
                newState = buyProperty(newState, currentPlayer.id, propertyId);
                logs.push(`${currentPlayer.name} bought ${property.name} for $${property.price}`);
              } else {
                logs.push(`${currentPlayer.name} decided not to buy ${property.name}`);
              }
              newState.gamePhase = 'end-turn';
            } else {
              // For human player, wait for their decision in UI
              newState.gamePhase = 'action';
            }
          } else if (property.status === 'owned' && property.owner !== currentPlayer.id) {
            // Pay rent
            const owner = state.players.find(p => p.id === property.owner)!;
            
            // Calculate rent based on property type
            let rentAmount = 0;
            
            if (property.color === 'railroad') {
              // Count how many railroads the owner has
              const railroadsOwned = state.properties
                .filter(p => p.color === 'railroad' && p.owner === owner.id)
                .length;
              rentAmount = property.rent[railroadsOwned - 1];
            } else if (property.color === 'utility') {
              // Count utilities and use dice roll
              const utilitiesOwned = state.properties
                .filter(p => p.color === 'utility' && p.owner === owner.id)
                .length;
              // Rent is 4x or 10x dice roll depending on utilities owned
              const multiplier = property.rent[utilitiesOwned - 1];
              rentAmount = multiplier * (state.lastRoll![0] + state.lastRoll![1]);
            } else {
              // Regular property rent
              rentAmount = property.rent[property.houses];
              
              // Check for monopoly (all properties of the same color owned by the same player)
              const sameColorProperties = state.properties.filter(p => p.color === property.color);
              const hasMonopoly = sameColorProperties.every(p => p.owner === owner.id);
              
              // Double rent for undeveloped property if monopoly
              if (hasMonopoly && property.houses === 0) {
                rentAmount *= 2;
              }
            }
            
            if (rentAmount > 0) {
              // Transfer money
              const updatedPlayers = state.players.map(player => {
                if (player.id === currentPlayer.id) {
                  return { ...player, money: player.money - rentAmount };
                } else if (player.id === owner.id) {
                  return { ...player, money: player.money + rentAmount };
                }
                return player;
              });
              
              newState = {
                ...newState,
                players: updatedPlayers,
                gamePhase: 'end-turn',
                logs: [...logs, `${currentPlayer.name} paid $${rentAmount} rent to ${owner.name} for ${property.name}`]
              };
            } else {
              newState.gamePhase = 'end-turn';
            }
          } else {
            // Property is owned by current player or is mortgaged
            newState.gamePhase = 'end-turn';
          }
          break;
        }
        
        case 'tax': {
          let taxAmount = 0;
          
          if (currentSpace.position === 4) { // Income Tax
            taxAmount = Math.min(200, Math.floor(currentPlayer.money * 0.1));
          } else if (currentSpace.position === 38) { // Luxury Tax
            taxAmount = 75;
          }
          
          const updatedPlayers = state.players.map(player => 
            player.id === currentPlayer.id 
              ? { ...player, money: player.money - taxAmount }
              : player
          );
          
          newState = {
            ...newState,
            players: updatedPlayers,
            gamePhase: 'end-turn',
            logs: [...logs, `${currentPlayer.name} paid $${taxAmount} in taxes`]
          };
          break;
        }
        
        case 'chance': {
          // Draw a chance card
          const card = newState.chanceCards[0];
          const updatedChanceCards = [...newState.chanceCards.slice(1), newState.chanceCards[0]];
          
          logs.push(`${currentPlayer.name} drew a Chance card: ${card.text}`);
          
          // Apply card action
          newState = card.action(currentPlayer.id, { ...newState, logs });
          newState.chanceCards = updatedChanceCards;
          newState.gamePhase = 'end-turn';
          break;
        }
        
        case 'community': {
          // Draw a community chest card
          const card = newState.communityCards[0];
          const updatedCommunityCards = [...newState.communityCards.slice(1), newState.communityCards[0]];
          
          logs.push(`${currentPlayer.name} drew a Community Chest card: ${card.text}`);
          
          // Apply card action
          newState = card.action(currentPlayer.id, { ...newState, logs });
          newState.communityCards = updatedCommunityCards;
          newState.gamePhase = 'end-turn';
          break;
        }
        
        case 'go-to-jail': {
          const updatedPlayers = state.players.map(player => 
            player.id === currentPlayer.id 
              ? { ...player, position: 10, jailTurns: 3, status: 'jailed' as PlayerStatus }
              : player
          );
          
          newState = {
            ...newState,
            players: updatedPlayers,
            gamePhase: 'end-turn',
            logs: [...logs, `${currentPlayer.name} was sent to Jail`]
          };
          break;
        }
        
        default:
          // For spaces like GO, Jail (just visiting), Free Parking
          newState.gamePhase = 'end-turn';
          break;
      }
      
      return newState;
    }
    
    case 'BUY_PROPERTY': {
      const { propertyId } = action.payload;
      return buyProperty(state, state.currentPlayerId, propertyId);
    }
    
    case 'DECLINE_PROPERTY': {
      // Find the property to auction
      const currentPlayer = state.players.find(p => p.id === state.currentPlayerId);
      const currentSpace = state.boardSpaces.find(space => space.position === currentPlayer?.position);
      let propertyId: number | null = null;
      if (
        currentSpace &&
        (currentSpace.type === 'property' || currentSpace.type === 'railroad' || currentSpace.type === 'utility') &&
        currentSpace.propertyId !== undefined
      ) {
        propertyId = currentSpace.propertyId;
      }
      if (propertyId !== null) {
        // Start auction
        const activePlayers = state.players.filter(p => p.status !== 'bankrupt');
        return {
          ...state,
          auctionActive: true,
          auctionPropertyId: propertyId,
          auctionBids: activePlayers.map(p => ({ playerId: p.id, bid: 0, active: true })),
          auctionCurrentBid: 0,
          auctionCurrentBidder: activePlayers[0].id,
          auctionPassed: [],
          gamePhase: 'auction',
          logs: [...state.logs, `Auction started for property ${propertyId}`],
        };
      }
      // fallback: no property found, just end turn
      return {
        ...state,
        gamePhase: 'end-turn',
        logs: [...state.logs, `Player ${state.currentPlayerId} declined to buy the property`]
      };
    }
    
    case 'MORTGAGE_PROPERTY': {
      const { propertyId } = action.payload;
      const property = state.properties.find(p => p.id === propertyId)!;
      
      // Update the property status
      const updatedProperties = state.properties.map(p => 
        p.id === propertyId ? { ...p, status: 'mortgaged' as PropertyStatus } : p
      );
      
      // Give mortgage value to player
      const updatedPlayers = state.players.map(player => 
        player.id === property.owner 
          ? { ...player, money: player.money + property.mortgageValue }
          : player
      );
      
      return {
        ...state,
        properties: updatedProperties,
        players: updatedPlayers,
        logs: [...state.logs, `Player ${property.owner} mortgaged ${property.name} for $${property.mortgageValue}`]
      };
    }
    
    case 'UNMORTGAGE_PROPERTY': {
      const { propertyId } = action.payload;
      const property = state.properties.find(p => p.id === propertyId)!;
      const redemptionCost = Math.ceil(property.mortgageValue * 1.1);
      
      // Update the property status
      const updatedProperties = state.properties.map(p => 
        p.id === propertyId ? { ...p, status: 'owned' as PropertyStatus } : p
      );
      
      // Deduct redemption cost from player
      const updatedPlayers = state.players.map(player => 
        player.id === property.owner 
          ? { ...player, money: player.money - redemptionCost }
          : player
      );
      
      return {
        ...state,
        properties: updatedProperties,
        players: updatedPlayers,
        logs: [...state.logs, `Player ${property.owner} unmortgaged ${property.name} for $${redemptionCost}`]
      };
    }
    
    case 'BUILD_HOUSE': {
      const { propertyId } = action.payload;
      const property = state.properties.find(p => p.id === propertyId)!;
      
      // Update the property
      const updatedProperties = state.properties.map(p => 
        p.id === propertyId ? { ...p, houses: p.houses + 1 } : p
      );
      
      // Deduct house cost from player
      const updatedPlayers = state.players.map(player => 
        player.id === property.owner 
          ? { ...player, money: player.money - property.houseCost }
          : player
      );
      
      return {
        ...state,
        properties: updatedProperties,
        players: updatedPlayers,
        logs: [...state.logs, `Player ${property.owner} built a house on ${property.name} for $${property.houseCost}`]
      };
    }
    
    case 'END_TURN': {
      // Check if the player rolled doubles
      const rolledDoubles = state.dice[0] === state.dice[1];
      
      // If doubles were rolled and it's not the third double, current player rolls again
      if (rolledDoubles && state.doubleRollCount < 3) {
        return {
          ...state,
          gamePhase: 'roll',
          logs: [...state.logs, `${state.players.find(p => p.id === state.currentPlayerId)?.name} rolled doubles and gets another turn`]
        };
      }
      
      // Check for bankrupt players
      const updatedPlayers = state.players.map(player => {
        if (player.money < 0 && player.status !== 'bankrupt') {
          return { ...player, status: 'bankrupt' as PlayerStatus };
        }
        return player;
      });
      
      // Find next player (skip bankrupt players)
      let nextPlayerIndex = state.players.findIndex(p => p.id === state.currentPlayerId);
      let nextPlayer;
      
      do {
        nextPlayerIndex = (nextPlayerIndex + 1) % updatedPlayers.length;
        nextPlayer = updatedPlayers[nextPlayerIndex];
      } while (nextPlayer.status === 'bankrupt' && nextPlayerIndex !== state.players.findIndex(p => p.id === state.currentPlayerId));
      
      // Check if the game is over (only one player left)
      const activePlayers = updatedPlayers.filter(p => p.status !== 'bankrupt');
      let winner = null;
      
      if (activePlayers.length === 1) {
        winner = activePlayers[0].id;
      }
      
      // Increment turn count when all players have played
      const turnCompleted = nextPlayerIndex === 0;
      const turnCount = turnCompleted ? state.turnCount + 1 : state.turnCount;
      
      return {
        ...state,
        players: updatedPlayers,
        currentPlayerId: nextPlayer.id,
        gamePhase: 'roll',
        doubleRollCount: 0,
        turnCount,
        winner,
        logs: [...state.logs, `Turn passed to ${nextPlayer.name}`]
      };
    }
    
    case 'USE_GET_OUT_OF_JAIL_CARD': {
      const updatedPlayers = state.players.map(player => 
        player.id === state.currentPlayerId 
          ? { 
              ...player, 
              jailTurns: 0, 
              status: 'playing' as PlayerStatus, 
              getOutOfJailCards: player.getOutOfJailCards - 1 
            }
          : player
      );
      
      return {
        ...state,
        players: updatedPlayers,
        gamePhase: 'roll',
        logs: [...state.logs, `${state.players.find(p => p.id === state.currentPlayerId)?.name} used a Get Out of Jail Free card`]
      };
    }
    
    case 'PAY_JAIL_FINE': {
      const updatedPlayers = state.players.map(player => 
        player.id === state.currentPlayerId 
          ? { 
              ...player, 
              jailTurns: 0, 
              status: 'playing' as PlayerStatus, 
              money: player.money - 50 
            }
          : player
      );
      
      return {
        ...state,
        players: updatedPlayers,
        gamePhase: 'roll',
        logs: [...state.logs, `${state.players.find(p => p.id === state.currentPlayerId)?.name} paid $50 to get out of jail`]
      };
    }
    
    case 'RESET_GAME': {
      return initialState;
    }
    
    case 'AUCTION_BID': {
      const { bid } = action.payload;
      if (!state.auctionActive || state.gamePhase !== 'auction' || state.auctionPropertyId == null) return state;
      // Update the current bidder's bid
      const updatedBids = (state.auctionBids || []).map(b =>
        b.playerId === state.auctionCurrentBidder ? { ...b, bid, active: true } : b
      );
      // Next active bidder
      const activeBidders = updatedBids.filter(b => b.active);
      let nextBidderIdx = activeBidders.findIndex(b => b.playerId === state.auctionCurrentBidder);
      nextBidderIdx = (nextBidderIdx + 1) % activeBidders.length;
      const nextBidderId = activeBidders[nextBidderIdx].playerId;
      // If only one active bidder remains, award property
      if (activeBidders.length === 1) {
        const winnerId = activeBidders[0].playerId;
        const winningBid = activeBidders[0].bid;
        // Update property and player
        const updatedProperties = state.properties.map(p =>
          p.id === state.auctionPropertyId ? { ...p, status: 'owned' as PropertyStatus, owner: winnerId } : p
        );
        const updatedPlayers = state.players.map(p =>
          p.id === winnerId ? { ...p, money: p.money - winningBid, properties: [...p.properties, state.auctionPropertyId!] } : p
        );
        return {
          ...state,
          properties: updatedProperties,
          players: updatedPlayers,
          auctionActive: false,
          auctionPropertyId: null,
          auctionBids: [],
          auctionCurrentBid: 0,
          auctionCurrentBidder: null,
          auctionPassed: [],
          gamePhase: 'end-turn',
          logs: [...state.logs, `Auction won by ${updatedPlayers.find(p => p.id === winnerId)?.name} for $${winningBid}`],
        };
      }
      return {
        ...state,
        auctionBids: updatedBids,
        auctionCurrentBid: bid,
        auctionCurrentBidder: nextBidderId,
        logs: [...state.logs, `${state.players.find(p => p.id === state.auctionCurrentBidder)?.name} bid $${bid}`],
      };
    }
    case 'AUCTION_PASS': {
      if (!state.auctionActive || state.gamePhase !== 'auction' || state.auctionPropertyId == null) return state;
      // Mark current bidder as inactive
      const updatedBids = (state.auctionBids || []).map(b =>
        b.playerId === state.auctionCurrentBidder ? { ...b, active: false } : b
      );
      // Next active bidder
      const activeBidders = updatedBids.filter(b => b.active);
      // If only one active bidder remains, award property
      if (activeBidders.length === 1) {
        const winnerId = activeBidders[0].playerId;
        const winningBid = activeBidders[0].bid;
        // Update property and player
        const updatedProperties = state.properties.map(p =>
          p.id === state.auctionPropertyId ? { ...p, status: 'owned' as PropertyStatus, owner: winnerId } : p
        );
        const updatedPlayers = state.players.map(p =>
          p.id === winnerId ? { ...p, money: p.money - winningBid, properties: [...p.properties, state.auctionPropertyId!] } : p
        );
        return {
          ...state,
          properties: updatedProperties,
          players: updatedPlayers,
          auctionActive: false,
          auctionPropertyId: null,
          auctionBids: [],
          auctionCurrentBid: 0,
          auctionCurrentBidder: null,
          auctionPassed: [],
          gamePhase: 'end-turn',
          logs: [...state.logs, `Auction won by ${updatedPlayers.find(p => p.id === winnerId)?.name} for $${winningBid}`],
        };
      }
      // Find next active bidder
      const currentIdx = activeBidders.findIndex(b => b.playerId === state.auctionCurrentBidder);
      const nextBidderIdx = (currentIdx + 1) % activeBidders.length;
      const nextBidderId = activeBidders[nextBidderIdx].playerId;
      return {
        ...state,
        auctionBids: updatedBids,
        auctionCurrentBidder: nextBidderId,
        logs: [...state.logs, `${state.players.find(p => p.id === state.auctionCurrentBidder)?.name} passed`],
      };
    }
    
    default:
      return state;
  }
};

// Helper function to buy property
const buyProperty = (state: GameState, playerId: number, propertyId: number): GameState => {
  const property = state.properties.find(p => p.id === propertyId)!;
  const player = state.players.find(p => p.id === playerId)!;
  
  if (player.money < property.price) {
    return {
      ...state,
      logs: [...state.logs, `${player.name} cannot afford to buy ${property.name}`]
    };
  }
  
  // Update property
  const updatedProperties = state.properties.map(p => 
    p.id === propertyId 
      ? { ...p, status: 'owned' as PropertyStatus, owner: playerId }
      : p
  );
  
  // Update player
  const updatedPlayers = state.players.map(p => 
    p.id === playerId 
      ? { 
          ...p, 
          money: p.money - property.price,
          properties: [...p.properties, propertyId]
        }
      : p
  );
  
  return {
    ...state,
    properties: updatedProperties,
    players: updatedPlayers,
    gamePhase: 'end-turn',
    logs: [...state.logs, `${player.name} bought ${property.name} for $${property.price}`]
  };
};

// Game context
interface GameContextProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

// Game provider
interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { toast } = useToast();

  React.useEffect(() => {
    // Handle AI player turns automatically
    const handleAiTurn = () => {
      const currentPlayer = state.players.find(p => p.id === state.currentPlayerId);
      // AI logic for normal turns
      if (currentPlayer && currentPlayer.isAI && state.winner === null) {
        if (state.gamePhase === 'roll') {
          setTimeout(() => {
            dispatch({ type: 'ROLL_DICE' });
          }, 1000);
        } else if (state.gamePhase === 'move') {
          setTimeout(() => {
            dispatch({ type: 'MOVE_PLAYER' });
          }, 1000);
        } else if (state.gamePhase === 'action') {
          setTimeout(() => {
            dispatch({ type: 'HANDLE_SPACE_ACTION' });
          }, 1000);
        } else if (state.gamePhase === 'end-turn') {
          setTimeout(() => {
            dispatch({ type: 'END_TURN' });
          }, 1000);
        }
      }
      // AI logic for auction
      if (state.gamePhase === 'auction' && state.auctionActive && state.auctionCurrentBidder != null) {
        const aiBidder = state.players.find(p => p.id === state.auctionCurrentBidder);
        if (aiBidder && aiBidder.isAI) {
          // Simple AI: bid if current bid is less than 70% of property price and AI has enough money, else pass
          const property = state.properties.find(p => p.id === state.auctionPropertyId);
          if (property) {
            const maxBid = Math.floor(property.price * 0.7);
            const nextBid = (state.auctionCurrentBid || 0) + 10;
            if (nextBid <= maxBid && nextBid <= aiBidder.money) {
              setTimeout(() => {
                dispatch({ type: 'AUCTION_BID', payload: { bid: nextBid } });
              }, 1000);
            } else {
              setTimeout(() => {
                dispatch({ type: 'AUCTION_PASS' });
              }, 1000);
            }
          }
        }
      }
    };
    handleAiTurn();
  }, [state.currentPlayerId, state.gamePhase, state.winner, state.players, state.auctionActive, state.auctionCurrentBidder, state.auctionCurrentBid, state.auctionPropertyId, state.properties]);

  // Show toast notifications for important events
  React.useEffect(() => {
    if (state.logs.length > 0) {
      const latestLog = state.logs[state.logs.length - 1];
      
      // Show toast for significant events only
      if (
        latestLog.includes('passed GO') ||
        latestLog.includes('sent to jail') ||
        latestLog.includes('bought') ||
        latestLog.includes('paid $') ||
        latestLog.includes('mortgaged') ||
        latestLog.includes('won the game')
      ) {
        toast({
          title: "Game Update",
          description: latestLog,
        });
      }
    }
  }, [state.logs, toast]);

  React.useEffect(() => {
    const currentPlayer = state.players.find(p => p.id === state.currentPlayerId);
    if (
      currentPlayer &&
      !currentPlayer.isAI &&
      state.gamePhase === 'move'
    ) {
      setTimeout(() => {
        dispatch({ type: 'MOVE_PLAYER' });
      }, 500);
    }
  }, [state.currentPlayerId, state.gamePhase, state.players]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
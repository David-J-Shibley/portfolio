import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  initialGameState, 
  GameState, 
  makeMove, 
  Move,
  PieceColor
} from '../utils/chessEngine';
import {
  connectToGame,
  disconnectFromGame,
  sendMessage,
  addMessageListener,
  removeMessageListener,
  addConnectionStateListener,
  removeConnectionStateListener,
  getPlayerId
} from '../utils/socket';
import ChessBoard from './ChessBoard';
import GameInfo from './GameInfo';
import { Button } from './ui/button';
import { toast } from 'sonner';

const GameRoom: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [playerColor, setPlayerColor] = useState<'w' | 'b' | 'spectator'>('spectator');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [movesHistory, setMovesHistory] = useState<Move[]>([]);
  const [opponents, setOpponents] = useState<string[]>([]);
  
  useEffect(() => {
    if (!gameId) {
      navigate('/');
      return;
    }

    // Connect to the game room
    connectToGame(gameId);
    
    // Set up connection status listener
    const handleConnectionState = (connected: boolean) => {
      setIsConnected(connected);
      if (connected) {
        toast.success("Connected to game room");
        // Announce presence and request current game state
        sendMessage({
          type: 'PLAYER_JOINED',
          payload: {
            gameId,
            playerId: getPlayerId(),
          }
        });
        
        sendMessage({
          type: 'REQUEST_GAME_STATE',
          payload: {
            gameId,
          }
        });
      } else {
        toast.error("Disconnected from game room");
      }
    };
    
    // Set up message listener
    const handleMessage = (message: any) => {
      console.log('Received message:', message);
      
      switch (message.type) {
        case 'GAME_STATE_UPDATE':
          if (message.payload.gameId === gameId) {
            setGameState(message.payload.gameState);
            setMovesHistory(message.payload.movesHistory || []);
          }
          break;
          
        case 'MOVE_MADE':
          if (message.payload.gameId === gameId) {
            const move = message.payload.move;
            setGameState(prevState => makeMove(prevState, move));
            setMovesHistory(prev => [...prev, move]);
          }
          break;
          
        case 'PLAYER_ASSIGNED':
          if (message.payload.gameId === gameId && message.payload.playerId === getPlayerId()) {
            setPlayerColor(message.payload.color);
            toast.success(`You are playing as ${message.payload.color === 'w' ? 'White' : 'Black'}`);
          }
          break;
          
        case 'PLAYERS_LIST':
          if (message.payload.gameId === gameId) {
            setOpponents(message.payload.players.filter((id: string) => id !== getPlayerId()));
          }
          break;
          
        case 'GAME_OVER':
          if (message.payload.gameId === gameId) {
            toast.info(`Game over: ${message.payload.result}`);
            // Update game state to reflect game over
            setGameState(prev => ({
              ...prev,
              gameOver: true,
              result: message.payload.result
            }));
          }
          break;
      }
    };
    
    // Register event listeners
    addConnectionStateListener(handleConnectionState);
    addMessageListener(handleMessage);
    
    // Clean up on unmount
    return () => {
      removeConnectionStateListener(handleConnectionState);
      removeMessageListener(handleMessage);
      disconnectFromGame();
    };
  }, [gameId, navigate]);
  
  // Handle making a move
  const handleMove = (move: Move) => {
    if (gameState.gameOver) {
      toast.error("Game is over!");
      return;
    }
    
    if (playerColor === 'spectator') {
      toast.error("You are only spectating this game");
      return;
    }
    
    if (playerColor !== gameState.turn) {
      toast.error("Not your turn!");
      return;
    }
    
    // Apply move locally first for instant feedback
    const newState = makeMove(gameState, move);
    setGameState(newState);
    setMovesHistory(prev => [...prev, move]);
    
    // Send move to server
    sendMessage({
      type: 'MAKE_MOVE',
      payload: {
        gameId,
        playerId: getPlayerId(),
        move,
      }
    });
  };
  
  // Handle player assignment
  const assignColor = (color: PieceColor) => {
    if (isConnected) {
      sendMessage({
        type: 'REQUEST_PLAYER_ASSIGNMENT',
        payload: {
          gameId,
          playerId: getPlayerId(),
          color,
        }
      });
    } else {
      toast.error("Not connected to server");
    }
  };
  
  // Handle returning to lobby
  const returnToLobby = () => {
    navigate('/chess');
  };
  
  const hasOpponents = opponents.length > 0;

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Chess Game</h1>
        <div className="text-sm text-muted-foreground mb-4">
          {isConnected ? (
            <span className="text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> Connected
            </span>
          ) : (
            <span className="text-red-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span> Disconnected
            </span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
          <ChessBoard 
            gameState={gameState} 
            playerColor={playerColor} 
            onMove={handleMove}
            lastMove={movesHistory.length > 0 ? movesHistory[movesHistory.length - 1] : null}
          />
          
          {playerColor === 'spectator' && !gameState.gameOver && (
            <div className="flex justify-center gap-4 mt-6">
              <Button 
                onClick={() => assignColor('w')} 
                variant="outline" 
                disabled={!isConnected}
                className="gap-2"
              >
                Play as White
              </Button>
              <Button 
                onClick={() => assignColor('b')} 
                variant="outline"
                disabled={!isConnected}
                className="gap-2"
              >
                Play as Black
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-6">
          <GameInfo 
            gameState={gameState} 
            gameId={gameId || 'unknown'} 
            playerColor={playerColor}
            movesHistory={movesHistory}
          />
          
          <div className="bg-card p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-2">Players</h3>
            {hasOpponents ? (
              <div className="text-sm mb-4">
                {opponents.length} other {opponents.length === 1 ? 'player' : 'players'} in this game
              </div>
            ) : (
              <div className="text-sm mb-4 text-muted-foreground">
                No other players have joined yet
              </div>
            )}
            
            <div className="mt-4">
              <Button onClick={returnToLobby} variant="secondary" size="sm" className="w-full">
                Return to Lobby
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
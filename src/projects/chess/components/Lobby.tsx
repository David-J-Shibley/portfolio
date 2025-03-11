import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { getPlayerId } from '../utils/socket';

const Lobby: React.FC = () => {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState<string>('');
  
  // Create a new game
  const createGame = () => {
    // Generate a random game ID
    const newGameId = Math.random().toString(36).substring(2, 10);
    navigate(`/chess/${newGameId}`);
    toast.success(`Game created! ID: ${newGameId}`);
  };
  
  // Join an existing game
  const joinGame = () => {
    if (!gameId.trim()) {
      toast.error('Please enter a game ID');
      return;
    }
    
    navigate(`/chess/${gameId.trim()}`);
  };
  
  // Get player information
  const playerId = getPlayerId();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Online Chess</h1>
          <p className="text-muted-foreground">Play chess with friends in real-time</p>
        </div>
        
        <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create a New Game</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Start a new chess match and invite a friend to play with you.
          </p>
          <Button onClick={createGame} className="w-full">
            Create Game
          </Button>
        </div>
        
        <div className="bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Join a Game</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Enter the game ID provided by your friend to join their game.
          </p>
          <div className="flex space-x-2 mb-4">
            <Input 
              placeholder="Enter Game ID" 
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
            />
            <Button onClick={joinGame}>
              Join
            </Button>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>Your Player ID: <span className="font-mono">{playerId.substring(0, 8)}</span></p>
          <p className="mt-2">
            Note: This demo uses a public WebSocket server for demonstration purposes.
            For a production app, you would use a dedicated WebSocket server.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
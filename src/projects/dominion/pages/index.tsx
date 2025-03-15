import React, { useState } from 'react';
import { GameProvider, useGame } from '../context/GameContext';
import GameBoard from '../components/GameBoard';
import CardModal from '../components/CardModal';
import { Card, SupplyPile } from '../utils/cards';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import './index.css'

// Welcome screen component
const WelcomeScreen = ({ onStartGame }: { onStartGame: (name: string, withBot: boolean) => void }) => {
  const [playerName, setPlayerName] = useState('Player');
  const [gameMode, setGameMode] = useState<'bot' | 'local'>('bot');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-1 tracking-tight">Dominion</h1>
          <p className="text-muted-foreground mb-8">A minimalist deck-building card game</p>
        </div>
        
        <div className="glass rounded-xl p-8 shadow-glass">
          <h2 className="text-xl font-semibold mb-6">New Game</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium mb-2">
                Your Name
              </label>
              <Input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full"
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Game Mode
              </label>
              <Tabs defaultValue="bot" value={gameMode} onValueChange={(value) => setGameMode(value as 'bot' | 'local')} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="bot">Play vs AI</TabsTrigger>
                  <TabsTrigger value="local">Local Game</TabsTrigger>
                </TabsList>
                <TabsContent value="bot" className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Play against an AI opponent that will challenge your strategy.
                  </p>
                </TabsContent>
                <TabsContent value="local" className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Play a local game where players take turns on the same device.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
            
            <Button 
              className="w-full"
              onClick={() => onStartGame(playerName || 'Player', gameMode === 'bot')}
            >
              Start Game
            </Button>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-muted-foreground">
          A modern interpretation of the classic deck-building game
        </div>
      </div>
    </div>
  );
};

// Game wrapper
const GameWrapper = () => {
  const { state, startGame } = useGame();
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedPile, setSelectedPile] = useState<SupplyPile | null>(null);
  
  // Update selected card when game state changes
  React.useEffect(() => {
    if (state?.selectedCard) {
      setSelectedCard(state.selectedCard);
    }
    
    if (state?.selectedPile) {
      setSelectedPile(state.selectedPile);
    }
  }, [state?.selectedCard, state?.selectedPile]);

  const handleStartGame = (playerName: string, withBot: boolean) => {
    startGame(playerName, withBot);
    setShowWelcome(false);
  };

  const handleStartNewGame = () => {
    setShowWelcome(true);
  };

  const handleCloseCardModal = () => {
    setSelectedCard(null);
    setSelectedPile(null);
  };

  // Determine which card to show in modal
  const cardToShow = selectedCard || (selectedPile ? selectedPile.card : null);

  return (
    <div className={cn(
      "bg-gradient-to-br from-background to-primary-lighter/20 min-h-screen",
      "overflow-hidden transition-all duration-500"
    )}>
      {showWelcome ? (
        <WelcomeScreen onStartGame={handleStartGame} />
      ) : (
        <GameBoard onStartNewGame={handleStartNewGame} />
      )}
      
      <CardModal 
        card={cardToShow} 
        isOpen={!!cardToShow} 
        onClose={handleCloseCardModal} 
      />
    </div>
  );
};

// Main Index component
const Index = () => {
  return (
    <GameProvider>
      <GameWrapper />
    </GameProvider>
  );
};

export default Index;

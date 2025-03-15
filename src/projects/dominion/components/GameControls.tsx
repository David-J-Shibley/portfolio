import React from 'react';
import { useGame } from '../context/GameContext';
import { Player } from '../utils/gameLogic';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const GameControls = () => {
  const { state, moveToNextPhase } = useGame();

  if (!state) return null;

  const currentPlayer = state.players[state.currentPlayerIndex];
  const isPlayerTurn = !currentPlayer.isBot;

  // Game statistics to display
  const renderPlayerStats = (player: Player) => (
    <div className={cn(
      "p-3 rounded-lg",
      "glass",
      "flex flex-col gap-1",
      state.currentPlayerIndex === state.players.indexOf(player) ? "ring-1 ring-primary" : "",
    )}>
      <div className="font-medium">{player.name}</div>
      <div className="flex gap-3 text-sm">
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground">Deck</span>
          <span>{player.deck.length}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground">Hand</span>
          <span>{player.hand.length}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground">Discard</span>
          <span>{player.discard.length}</span>
        </div>
      </div>
    </div>
  );

  // Current action/buy/coin information
  const renderCurrentPhaseInfo = () => (
    <div className="p-3 rounded-lg glass">
      <div className="font-medium capitalize">
        {state.phase === 'gameOver' ? 'Game Over' : `${state.phase} Phase`}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-1">
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground">Actions</span>
          <span className="font-medium">{currentPlayer.actions}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground">Buys</span>
          <span className="font-medium">{currentPlayer.buys}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground">Coins</span>
          <span className="font-medium">{currentPlayer.coins}</span>
        </div>
      </div>
    </div>
  );

  // Next phase button
  const renderNextPhaseButton = () => {
    if (!isPlayerTurn || state.phase === 'gameOver') return null;

    let buttonText = '';
    
    if (state.phase === 'action') {
      buttonText = 'Go to Buy Phase';
    } else if (state.phase === 'buy') {
      buttonText = 'End Turn';
    }

    return (
      <Button 
        onClick={moveToNextPhase}
        className="w-full mt-2"
      >
        {buttonText}
      </Button>
    );
  };

  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="text-sm font-semibold text-foreground/80">Game Info</div>
      
      {/* Turn indicator */}
      <div className="text-center p-2 bg-primary/10 rounded-md font-medium">
        Turn {state.turnNumber} • {currentPlayer.name}'s Turn
      </div>
      
      {/* Player stats */}
      <div className="grid grid-cols-1 gap-2 mt-2">
        {state.players.map((player, idx) => (
          <div key={`player-${idx}`}>{renderPlayerStats(player)}</div>
        ))}
      </div>
      
      {/* Current phase info */}
      <div className="mt-2">
        {renderCurrentPhaseInfo()}
      </div>
      
      {/* Next phase button */}
      {renderNextPhaseButton()}
    </div>
  );
};

export default GameControls;

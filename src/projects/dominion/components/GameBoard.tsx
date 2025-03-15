import { useEffect } from 'react';
import Hand from './Hand';
import Deck from './Deck';
import ActionArea from './ActionArea';
import CardPile from './CardPile';
import GameControls from './GameControls';
import { useGame } from '../context/GameContext';
import { calculateVictoryPoints } from '../utils/gameLogic';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  onStartNewGame: () => void;
}

const GameBoard = ({ onStartNewGame }: GameBoardProps) => {
  const { state } = useGame();

  useEffect(() => {
    // Any initialization if needed
  }, []);

  if (!state) return null;

  const currentPlayer = state.players[state.currentPlayerIndex];

  // Game log display
  const renderGameLog = () => (
    <div className="h-32 overflow-y-auto p-3 rounded-lg glass">
      <div className="text-sm font-semibold mb-1">Game Log</div>
      <div className="space-y-1 text-xs text-foreground/90">
        {state.log.slice(-10).map((entry, idx) => (
          <div key={`log-${idx}`} className="py-1 border-b border-border/30 last:border-0">
            {entry}
          </div>
        ))}
      </div>
    </div>
  );

  // Game over screen
  const renderGameOver = () => {
    if (state.phase !== 'gameOver') return null;

    // Calculate and display scores
    const scores = state.players.map(player => ({
      name: player.name,
      points: calculateVictoryPoints(player)
    }));

    // Sort by points (highest first)
    scores.sort((a, b) => b.points - a.points);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-card p-6 rounded-lg shadow-lg max-w-lg w-full animate-scale-in">
          <h2 className="text-2xl font-bold text-center mb-6">Game Over</h2>
          
          <div className="space-y-4 mb-6">
            <h3 className="text-xl font-semibold">Final Scores</h3>
            {scores.map((score, idx) => (
              <div 
                key={`score-${idx}`}
                className={cn(
                  "flex justify-between items-center p-3 rounded-lg",
                  idx === 0 ? "bg-primary-lighter/30 font-bold" : "bg-muted/30"
                )}
              >
                <span>
                  {idx === 0 && "👑 "}{score.name}
                </span>
                <span className="text-xl">
                  {score.points} {score.points === 1 ? "point" : "points"}
                </span>
              </div>
            ))}
          </div>
          
          <Button onClick={onStartNewGame} className="w-full">
            Start New Game
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto p-4 md:p-6">
      {/* Game layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        {/* Supply piles (kingdom + base cards) */}
        <div className="col-span-1 md:col-span-3">
          <div className="text-sm font-semibold mb-2 text-foreground/80">Supply</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 bg-muted/30 p-3 rounded-lg animate-fade-in">
            {state.supply.map((pile, index) => (
              <CardPile key={`pile-${index}`} pile={pile} index={index} />
            ))}
          </div>
        </div>
        
        {/* Game controls and player info */}
        <div className="col-span-1 md:row-span-3 order-3 md:order-2">
          <div className="sticky top-4">
            <GameControls />
            {renderGameLog()}
          </div>
        </div>
        
        {/* Player area */}
        <div className="col-span-1 md:col-span-3 order-2 md:order-3">
          {/* Current player's play area */}
          <div className="bg-muted/20 rounded-lg animate-fade-in">
            <ActionArea cards={currentPlayer.playArea} />
          </div>
          
          {/* Current player's hand */}
          <div className="mt-4 bg-muted/20 rounded-lg animate-fade-in">
            <Hand cards={currentPlayer.hand} />
          </div>
          
          {/* Deck and discard piles */}
          <div className="mt-4 flex justify-center gap-6 animate-fade-in">
            <Deck count={currentPlayer.deck.length} type="deck" />
            <Deck count={currentPlayer.discard.length} type="discard" />
          </div>
        </div>
      </div>
      
      {/* Game over overlay */}
      {renderGameOver()}
    </div>
  );
};

export default GameBoard;
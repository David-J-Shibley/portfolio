import { useEffect } from 'react';
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import DiceContainer from '../components/Dice';
import ScoreBoard from '../components/ScoreBoard';
import RollButton from '../components/RollButton';
import GameRules from '../components/GameRules';
import useFarkleGame from '../hooks/useFarkleGame';

import '../index.css'

const Index = () => {
  const { toast } = useToast();
  const game = useFarkleGame(2, 10000); // 2 players, 10,000 winning score
  
  // Welcome message
  useEffect(() => {
    setTimeout(() => {
      toast({
        title: "Welcome to Farkle!",
        description: "Roll the dice to start playing. Click on scoring dice to select them."
      });
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-accent/20">
      {/* Header with title and rules */}
      <header className="flex justify-between items-center p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-shadow-sm">
          Farkle
        </h1>
        <GameRules 
          trigger={
            <Button variant="outline" size="sm">
              Rules
            </Button>
          } 
        />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Main Game Area */}
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
          {/* Dice Display */}
          <div className="w-full glassmorphism rounded-xl p-6 mb-6 shadow-sm animate-scale-in">
            <DiceContainer 
              dice={game.dice}
              selectedDice={game.selectedDice}
              toggleDiceSelection={game.toggleDiceSelection}
              isRolling={game.isRolling}
              scoreableDice={game.scoreableDice}
            />
            
            {/* Game Status Messages */}
            {game.farkled && (
              <div className="text-center my-4 text-destructive font-medium animate-fade-in">
                Farkle! No scoring dice. Your turn is over.
              </div>
            )}
            
            {game.hotDice && (
              <div className="text-center my-4 text-primary font-medium animate-fade-in">
                Hot dice! All dice are scoring. Roll again with all 6 dice.
              </div>
            )}
            
            {game.gameEnded && (
              <div className="text-center my-4 font-medium animate-fade-in">
                Game Over! {game.players.sort((a, b) => b.score - a.score)[0].name} wins!
              </div>
            )}
          </div>
          
          {/* Game Controls */}
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
            <RollButton 
              size="lg"
              disabled={game.isRolling || game.gameEnded || (game.selectedDice.length === 0 && game.turnScore > 0)}
              isLoading={game.isRolling}
              onClick={game.rollDice}
              className="w-full md:w-auto min-w-[150px]"
            >
              {game.farkled ? "Next Player" : "Roll Dice"}
            </RollButton>
            
            <RollButton
              variant="secondary"
              size="lg"
              disabled={game.isRolling || game.selectedDice.length === 0 || game.farkled || game.gameEnded}
              onClick={game.bankScore}
              className="w-full md:w-auto min-w-[150px]"
            >
              Bank {game.turnScore} Points
            </RollButton>
            
            {game.gameEnded && (
              <RollButton
                variant="outline"
                size="lg"
                onClick={game.resetGame}
                className="w-full md:w-auto min-w-[150px]"
              >
                New Game
              </RollButton>
            )}
          </div>
          
          {/* Player Scores */}
          <ScoreBoard 
            players={game.players}
            turnScore={game.turnScore}
            gameWinningScore={game.winningScore}
          />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="text-center p-4 text-sm text-muted-foreground">
        <p>Dice remaining: {game.availableDice}</p>
        {game.finalRound && <p className="mt-1">Final Round</p>}
      </footer>
    </div>
  );
};

export default Index;
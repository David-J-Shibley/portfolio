import { useEffect } from 'react';
import { useGame, GameProvider } from '../context/GameContext';
import { Choice } from '../types/game';
import GameCard from '../components/GameCard';
import ScoreBoard from '../components/ScoreBoard';
import AnimatedHand from '../components/AnimatedHand';
import GameHistory from '../components/GameHistory';
import Statistics from '../components/Statistics';
import Layout from '../components/Layout';
import { Button } from '../../../components/ui/button';
import { RefreshCw, Play } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

import './index.css'

const Index = () => {
  const { gameState, setPlayerChoice, playRound, resetGame } = useGame();
  
  const handleChoiceSelect = (choice: Choice) => {
    setPlayerChoice(choice);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.isPlaying) return;
      
      switch (e.key.toLowerCase()) {
        case 'r':
          handleChoiceSelect('rock');
          break;
        case 'p':
          handleChoiceSelect('paper');
          break;
        case 's':
          handleChoiceSelect('scissors');
          break;
        case ' ':
          if (gameState.playerChoice) {
            playRound();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameState.isPlaying, gameState.playerChoice, setPlayerChoice, playRound]);

  const resultText = () => {
    if (!gameState.result) return null;
    
    switch (gameState.result) {
      case 'win':
        return <span className="text-green-500 font-medium text-xl">You Win!</span>;
      case 'lose':
        return <span className="text-red-500 font-medium text-xl">You Lose</span>;
      case 'draw':
        return <span className="text-yellow-500 font-medium text-xl">Draw</span>;
      default:
        return null;
    }
  };

  // Function to handle keyboard shortcuts toast
  const showKeyboardShortcuts = () => {
    toast(
      "Keyboard Shortcuts",
      {
        description: "R: Rock, P: Paper, S: Scissors, Space: Play",
      }
    );
  };

  useEffect(() => {
    // Show keyboard shortcuts toast when component mounts
    const timer = setTimeout(() => {
      showKeyboardShortcuts();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <GameProvider>
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Score and Choices */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <ScoreBoard />
            
            <div className="glass-morphism rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4">Choose Your Weapon</h2>
              <div className="grid grid-cols-1 gap-4">
                {(['rock', 'paper', 'scissors'] as Choice[]).map((choice) => (
                  <GameCard
                    key={choice}
                    choice={choice}
                    selected={gameState.playerChoice === choice}
                    onClick={() => handleChoiceSelect(choice)}
                    disabled={gameState.isPlaying}
                  />
                ))}
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button
                  onClick={playRound}
                  disabled={!gameState.playerChoice || gameState.isPlaying}
                  className="w-full"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </Button>
                
                <Button
                  variant="outline"
                  onClick={resetGame}
                  disabled={!gameState.playerChoice && !gameState.computerChoice}
                  className="w-1/3"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              
              <button 
                onClick={showKeyboardShortcuts}
                className="text-xs text-muted-foreground mt-3 hover:text-primary transition-colors"
              >
                Keyboard shortcuts
              </button>
            </div>
          </div>
          
          {/* Middle Column: Game Arena */}
          <div className="md:col-span-1 flex flex-col justify-start">
            <div className="glass-morphism rounded-xl p-6 flex flex-col items-center h-full justify-between">
              <div className="text-center mb-4">
                <h2 className="text-lg font-medium">Game Arena</h2>
              </div>
              
              <div className="flex flex-col items-center justify-between h-full py-8">
                <div className="transform rotate-180">
                  <AnimatedHand 
                    choice={gameState.computerChoice} 
                    isComputer={true}
                    isPlaying={gameState.isPlaying}
                    animationDelay={100}
                  />
                  <div className="text-center mt-4">
                    <span className="bg-muted/50 px-3 py-1 rounded-full text-sm">
                      Computer
                    </span>
                  </div>
                </div>
                
                <div className="my-8 flex flex-col items-center justify-center h-16">
                  {gameState.isPlaying ? (
                    <div className="animate-pulse">
                      <span className="text-lg">Playing...</span>
                    </div>
                  ) : (
                    resultText()
                  )}
                </div>
                
                <div>
                  <AnimatedHand 
                    choice={gameState.playerChoice} 
                    isPlaying={gameState.isPlaying}
                  />
                  <div className="text-center mt-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                      You
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Stats and History */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <Statistics />
            <GameHistory />
          </div>
        </div>
      </div>
    </Layout>
    </GameProvider>
  );
};

export default Index;
import { GameProvider, useGame } from '../contexts/GameContext';
import GameBoard from '../components/GameBoard';
import GameControls from '../components/GameControls';
import GameStats from '../components/GameStats';
import GameHistory from '../components/GameHistory';
import { Dice1, Github } from 'lucide-react';

import './index.css'

// Main game component that uses the GameContext
const Game = () => {
  const { 
    gameState, 
    gameStats, 
    makeMove, 
    resetGame, 
    changeMode, 
    changeDifficulty, 
    undoMove, 
    resetStats 
  } = useGame();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Dice1 className="text-primary" size={32} />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Tic Tac Toe</h1>
        </div>
        <p className="text-muted-foreground max-w-lg mx-auto">
          A beautiful, minimalist take on the classic game with statistics tracking and AI opponent.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="flex justify-center">
            <GameBoard 
              board={gameState.board} 
              winningLine={gameState.winningLine} 
              onCellClick={makeMove} 
              currentPlayer={gameState.currentPlayer}
              gameStatus={gameState.status}
            />
          </div>
          
          <GameControls 
            onResetGame={resetGame}
            onChangeMode={changeMode}
            onChangeDifficulty={changeDifficulty}
            onUndoMove={undoMove}
            onResetStats={resetStats}
            currentMode={gameState.mode}
            currentDifficulty={gameState.difficulty}
            canUndo={gameState.moveHistory.length > 0}
          />
        </div>
        
        <div className="space-y-6">
          <GameStats 
            stats={gameStats} 
            currentPlayer={gameState.currentPlayer}
            gameStatus={gameState.status}
          />
          
          <GameHistory 
            history={gameState.moveHistory}
            currentPlayer={gameState.currentPlayer}
          />
        </div>
      </div>
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-1">
          <span>Created with care</span>
          <span className="text-xs mx-1">•</span>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center hover:text-foreground transition-colors"
          >
            <Github size={14} className="mr-1" />
            <span>View on GitHub</span>
          </a>
        </p>
      </footer>
    </div>
  );
};

// Wrap the Game component with the GameProvider
const Index = () => {
  return (
    <GameProvider>
      <div className="min-h-screen pb-10">
        <Game />
      </div>
    </GameProvider>
  );
};

export default Index;
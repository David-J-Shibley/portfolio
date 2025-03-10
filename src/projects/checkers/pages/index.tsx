import GameBoard from '../components/GameBoard';
import GameControls from '../components/GameControls';
import GameOver from '../components/GameOver';
import { useCheckersGame } from '../hooks/useCheckersGame';

const Checkers = () => {
  const { gameState, selectTile, resetGame } = useCheckersGame();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-100 to-amber-200 p-4">
      <header className="container mx-auto text-center mb-8 mt-8 animate-fade-in">
        <h1 className="text-5xl font-bold tracking-tight mb-2 text-amber-900">Checkers</h1>
        <p className="text-amber-700 text-lg">Classic two-player strategy board game</p>
      </header>
      
      <main className="container mx-auto flex-grow flex flex-col md:flex-row gap-8 items-center justify-center px-4">
        <div className="flex-1 flex justify-center relative">
          <div className="absolute -inset-4 rounded-2xl bg-amber-800/10 blur-xl -z-10"></div>
          <GameBoard 
            board={gameState.board} 
            onTileClick={selectTile} 
          />
        </div>
        
        <div className="w-full md:w-96">
          <GameControls 
            gameState={gameState} 
            onReset={resetGame} 
          />
        </div>
      </main>
      
      <GameOver 
        isOpen={gameState.gameOver} 
        winner={gameState.winner} 
        onReset={resetGame} 
      />
      
      <footer className="container mx-auto py-6 text-center text-amber-600 text-sm">
        <p className="font-medium">Designed with precision & simplicity</p>
      </footer>
    </div>
  );
};

export default Checkers;

import { GameProvider } from '../context/GameContext';
import ChessGame from '../components/ChessGame';

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Chess Game</h1>
      <p className="text-center mb-6">Play chess with a friend on the same browser</p>
      
      <GameProvider>
        <ChessGame />
      </GameProvider>
    </div>
  );
};

export default Index;
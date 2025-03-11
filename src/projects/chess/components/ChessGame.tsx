
import ChessBoard from './ChessBoard';
import GameControls from './GameControls';
import MoveHistory from './MoveHistory';
import { useGame } from '../context/GameContext';

const ChessGame = () => {
  const { gameState } = useGame();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <ChessBoard />
      </div>
      <div className="space-y-6">
        <GameControls />
        {gameState && <MoveHistory />}
      </div>
    </div>
  );
};

export default ChessGame;
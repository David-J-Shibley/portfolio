import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { useGame } from '../context/GameContext';
import { Shield, AlertTriangle } from 'lucide-react';

const GameControls = () => {
  const { gameState, resetGame, currentPlayer, isKingInCheck, isGameOver } = useGame();

  if (!gameState) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Game Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p>Status: <span className="font-semibold capitalize">{gameState.status}</span></p>
            <p>Current turn: <span className="font-semibold capitalize">{currentPlayer}</span></p>
          </div>
        </div>
        
        <div className={`p-3 rounded border ${
          currentPlayer === 'white' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-800 border-gray-700 text-white'
        }`}>
          {isGameOver ? (
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>Game over! {gameState.status === 'checkmate' ? (currentPlayer === 'white' ? 'Black' : 'White') + ' wins!' : 'Draw'}</span>
            </div>
          ) : isKingInCheck ? (
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span>{currentPlayer} king is in check!</span>
            </div>
          ) : (
            <span>{currentPlayer === 'white' ? 'White' : 'Black'} to move</span>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={resetGame} className="w-full">
          Reset Game
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GameControls;

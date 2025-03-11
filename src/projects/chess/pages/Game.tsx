import { useParams } from 'react-router-dom';
import GameRoom from '../components/GameRoom';

const Game = () => {
  const { gameId } = useParams<{ gameId: string }>();
  
  if (!gameId) {
    return <div>Invalid game ID</div>;
  }
  
  return (
    <GameRoom />
  );
};

export default Game;
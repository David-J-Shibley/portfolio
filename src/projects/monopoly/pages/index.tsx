import GameBoard from '../components/GameBoard';
import { GameProvider } from '../context/GameContext';

import './index.css'

const Index = () => {
  console.log('HERE')
  return (
    <GameProvider>
      <GameBoard />
    </GameProvider>
  );
};

export default Index;

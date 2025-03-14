import SnakeGame from "../components/SnakeGame";

import './index.css'

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-game-background px-4 py-8">
      <h1 className="text-4xl font-bold mb-2 text-white">Snake Game</h1>
      <p className="text-gray-300 mb-8">Use arrow keys or touch controls to play</p>
      
      <div className="w-full max-w-[500px]">
        <SnakeGame />
      </div>
    </div>
  );
};

export default Index;
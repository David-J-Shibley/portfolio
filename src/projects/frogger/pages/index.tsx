import { useState } from "react";
import FroggerGame from "../components/FroggerGame";
import GameStart from "../components/GameStart";

import './index.css'

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-100 to-blue-100 p-4">
      {!gameStarted ? (
        <GameStart onStartGame={() => setGameStarted(true)} />
      ) : (
        <FroggerGame />
      )}
    </div>
  );
};

export default Index;
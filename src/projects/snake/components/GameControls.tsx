import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { Direction } from "../utils/gameUtils";

interface GameControlsProps {
  onDirectionChange: (direction: Direction) => void;
  onPauseToggle: () => void;
  onRestart: () => void;
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  highScore: number;
}

const GameControls: React.FC<GameControlsProps> = ({
  onDirectionChange,
  onPauseToggle,
  onRestart,
  isPaused,
  gameOver,
  score,
  highScore,
}) => {
  // Handle direction button clicks
  const handleDirectionClick = (direction: Direction) => {
    onDirectionChange(direction);
  };

  return (
    <div className="w-full max-w-[500px] mt-4">
      {/* Score Display */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-semibold">
          Score: {score}
        </div>
        <div className="flex gap-2 items-center text-xl font-semibold">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>High Score: {highScore}</span>
        </div>
      </div>

      {/* Game Control Buttons */}
      <div className="flex justify-between mb-6">
        <Button 
          variant="outline" 
          size="icon"
          className="h-12 w-12" 
          onClick={onPauseToggle}
          disabled={gameOver}
        >
          {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-12 w-12" 
          onClick={onRestart}
        >
          <RotateCcw className="h-6 w-6" />
        </Button>
      </div>

      {/* Direction Buttons for Mobile */}
      <div className="md:hidden">
        <div className="flex justify-center mb-4">
          <button 
            className="controls-btn" 
            onClick={() => handleDirectionClick("UP")}
          >
            <ArrowUp className="h-6 w-6" />
          </button>
        </div>
        <div className="flex justify-between">
          <button 
            className="controls-btn" 
            onClick={() => handleDirectionClick("LEFT")}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <button 
            className="controls-btn" 
            onClick={() => handleDirectionClick("DOWN")}
          >
            <ArrowDown className="h-6 w-6" />
          </button>
          <button 
            className="controls-btn" 
            onClick={() => handleDirectionClick("RIGHT")}
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Keyboard Instructions for Desktop */}
      <div className="hidden md:block mt-4">
        <p className="text-center text-sm text-muted-foreground">
          Use arrow keys or WASD to control the snake
        </p>
      </div>
    </div>
  );
};

export default GameControls;
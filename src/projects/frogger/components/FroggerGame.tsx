import { useEffect } from "react";
import { useFroggerGame } from "../hooks/useFroggerGame";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Trophy, RotateCw, Play } from "lucide-react";
import { ROWS, GRID_SIZE } from "../utils/gameConstants";

const FroggerGame = () => {
  const {
    frogPosition,
    frogDirection,
    obstacles,
    completedHomes,
    status,
    resetGame,
    nextLevel,
    gameWidth,
    gameHeight,
    currentLevel,
  } = useFroggerGame();

  // Set up keyboard focus when component mounts
  useEffect(() => {
    // Find a focusable element and focus it
    const gameContainer = document.getElementById("game-container");
    if (gameContainer) {
      gameContainer.focus();
    }
  }, []);

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <div className="mb-2 w-full flex justify-between items-center">
        <div className="text-lg font-bold text-green-800">
          Level: {status.level}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Trophy className="h-5 w-5 text-yellow-500 mr-1" />
            <span className="font-semibold">{status.score}</span>
          </div>
          <div className="flex items-center ml-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`h-5 w-5 ${
                  i < status.lives ? "text-red-500" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div 
        id="game-container"
        tabIndex={0}
        className="relative bg-frogger-grass border-4 border-green-800 rounded-lg overflow-hidden shadow-lg"
        style={{ width: gameWidth, height: gameHeight }}
      >
        {/* Game Board */}
        <div className="relative w-full h-full">
          {/* Safe zones */}
          <div className="absolute top-0 left-0 w-full h-12 bg-frogger-grass" />
          <div 
            className="absolute w-full bg-frogger-grass"
            style={{ 
              top: `${(ROWS - 1) * GRID_SIZE}px`, 
              height: `${GRID_SIZE}px` 
            }}
          />
          
          {/* River zone */}
          {currentLevel.riverRows.map((rowIndex) => (
            <div
              key={`river-${rowIndex}`}
              className="absolute w-full bg-frogger-water"
              style={{
                top: `${rowIndex * GRID_SIZE}px`,
                height: `${GRID_SIZE}px`,
              }}
            />
          ))}

          {/* Road zone */}
          {currentLevel.roadRows.map((rowIndex) => (
            <div
              key={`road-${rowIndex}`}
              className="absolute w-full bg-frogger-road"
              style={{
                top: `${rowIndex * GRID_SIZE}px`,
                height: `${GRID_SIZE}px`,
              }}
            />
          ))}

          {/* Home zone with lily pads */}
          {currentLevel.homeRows.map((rowIndex) => (
            <div
              key={`home-${rowIndex}`}
              className="absolute w-full"
              style={{
                top: `${rowIndex * GRID_SIZE}px`,
                height: `${GRID_SIZE}px`,
              }}
            >
              {/* Lily pads for homes */}
              {[1, 3, 5, 7, 9].map((colIndex, i) => (
                <div
                  key={`lilypad-${i}`}
                  className={`absolute rounded-full 
                    ${completedHomes[i] ? "bg-green-300" : "bg-green-200"} 
                    border-2 border-green-500 flex items-center justify-center`}
                  style={{
                    left: `${colIndex * GRID_SIZE}px`,
                    top: "4px",
                    width: `${GRID_SIZE - 8}px`,
                    height: `${GRID_SIZE - 8}px`,
                  }}
                >
                  {completedHomes[i] && (
                    <div className="w-6 h-6 bg-frogger-frog rounded-full" />
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Obstacles - Cars, Logs, Turtles */}
          {obstacles.map((obstacle) => {
            let bgColor = "";
            switch (obstacle.type) {
              case "car1":
                bgColor = "bg-frogger-car1";
                break;
              case "car2":
                bgColor = "bg-frogger-car2";
                break;
              case "car3":
                bgColor = "bg-frogger-car3";
                break;
              case "log":
                bgColor = "bg-frogger-log";
                break;
              case "turtle":
                bgColor = "bg-frogger-turtle";
                break;
            }
            
            return (
              <div
                key={obstacle.id}
                className={`absolute ${bgColor} rounded`}
                style={{
                  left: `${obstacle.position.x * GRID_SIZE}px`,
                  top: `${obstacle.position.y * GRID_SIZE}px`,
                  width: `${obstacle.width * GRID_SIZE}px`,
                  height: `${GRID_SIZE - 4}px`,
                  marginTop: "2px",
                }}
              />
            );
          })}

          {/* Frog */}
          <div
            className={`absolute bg-frogger-frog rounded-full transition-transform ${
              status.gameState === 'playing' ? 'animate-hop' : ''
            }`}
            style={{
              left: `${frogPosition.x * GRID_SIZE + 4}px`,
              top: `${frogPosition.y * GRID_SIZE + 4}px`,
              width: `${GRID_SIZE - 8}px`,
              height: `${GRID_SIZE - 8}px`,
              transform: `rotate(${
                frogDirection === "up"
                  ? "0deg"
                  : frogDirection === "right"
                  ? "90deg"
                  : frogDirection === "down"
                  ? "180deg"
                  : "-90deg"
              })`,
              transition: "transform 0.1s ease-out",
            }}
          >
            {/* Frog eyes */}
            <div className="relative w-full h-full">
              <div className="absolute bg-white rounded-full w-2 h-2 left-2 top-1"></div>
              <div className="absolute bg-white rounded-full w-2 h-2 right-2 top-1"></div>
            </div>
          </div>

          {/* Game state overlays */}
          {status.gameState === "paused" && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
              <Card className="p-6 w-3/4 text-center">
                <h2 className="text-2xl font-bold mb-4">Game Paused</h2>
                <p className="mb-4">Press ESC to resume or R to restart</p>
                <div className="flex justify-center gap-2">
                  <Button onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape'}))}>
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetGame}
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    Restart
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {status.gameState === "gameOver" && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
              <Card className="p-6 w-3/4 text-center">
                <h2 className="text-2xl font-bold mb-2 text-red-500">Game Over</h2>
                <p className="mb-2">Final Score: {status.score}</p>
                <p className="mb-4">Press R to play again</p>
                <Button onClick={resetGame}>
                  <RotateCw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </Card>
            </div>
          )}

          {status.gameState === "levelComplete" && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
              <Card className="p-6 w-3/4 text-center">
                <h2 className="text-2xl font-bold mb-2 text-green-500">Level Complete!</h2>
                <p className="mb-2">Score: {status.score}</p>
                <p className="mb-4">Get ready for Level {status.level + 1}</p>
                <Button onClick={nextLevel}>
                  Continue
                </Button>
              </Card>
            </div>
          )}

          {status.gameState === "gameComplete" && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
              <Card className="p-6 w-3/4 text-center">
                <h2 className="text-2xl font-bold mb-2 text-yellow-500">Victory!</h2>
                <p className="mb-2">You completed all levels!</p>
                <p className="mb-2">Final Score: {status.score}</p>
                <Button onClick={resetGame}>
                  <RotateCw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </Card>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>Use arrow keys to move • Esc to pause • R to restart</p>
      </div>
    </div>
  );
};

export default FroggerGame;

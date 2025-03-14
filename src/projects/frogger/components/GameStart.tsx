import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface GameStartProps {
  onStartGame: () => void;
}

const GameStart = ({ onStartGame }: GameStartProps) => {
  return (
    <div className="max-w-lg w-full bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold text-green-600 mb-4 flex items-center justify-center gap-2">
        Lily Pad Leap
        <Trophy className="w-8 h-8 text-yellow-500" />
      </h1>
      
      <div className="mt-6 mb-8 space-y-4 text-left">
        <p className="font-medium text-gray-700">Guide your frog safely across busy roads and hazardous rivers to reach the lily pads.</p>
        
        <div className="bg-green-50 p-4 rounded-md border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">How to Play:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            <li>Use arrow keys to move your frog</li>
            <li>Avoid cars on the road</li>
            <li>Use logs and turtles to cross the river</li>
            <li>Reach all lily pads to complete a level</li>
            <li>Complete all levels to win!</li>
          </ul>
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button 
          onClick={onStartGame} 
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all hover:scale-105"
        >
          Start Game
        </Button>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Arrow keys to move • Esc to pause • R to restart</p>
      </div>
    </div>
  );
};

export default GameStart;
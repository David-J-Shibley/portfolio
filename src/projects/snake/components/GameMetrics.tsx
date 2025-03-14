import React from "react";
import { GameMetrics as GameMetricsType, formatTime } from "../utils/gameUtils";
import { Button } from "@/components/ui/button";
import { BarChart, Clock, Award, Activity, Apple, Zap } from "lucide-react";

interface GameMetricsProps {
  metrics: GameMetricsType;
  onClose: () => void;
}

const GameMetrics: React.FC<GameMetricsProps> = ({ metrics, onClose }) => {
  return (
    <div className="bg-game-background border-2 border-gray-700 rounded-xl p-4 text-white w-full max-w-[500px] animate-in fade-in-50 duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Game Statistics
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClose}
          className="text-white hover:bg-gray-700"
        >
          Close
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 bg-gray-800 p-3 rounded-lg">
          <div className="text-gray-400 text-sm flex items-center gap-1">
            <Activity className="h-4 w-4" />
            Games Played
          </div>
          <div className="text-xl font-bold">{metrics.gamesPlayed}</div>
        </div>
        
        <div className="flex flex-col gap-1 bg-gray-800 p-3 rounded-lg">
          <div className="text-gray-400 text-sm flex items-center gap-1">
            <Award className="h-4 w-4" />
            Average Score
          </div>
          <div className="text-xl font-bold">{metrics.averageScore}</div>
        </div>
        
        <div className="flex flex-col gap-1 bg-gray-800 p-3 rounded-lg">
          <div className="text-gray-400 text-sm flex items-center gap-1">
            <Zap className="h-4 w-4" />
            Longest Snake
          </div>
          <div className="text-xl font-bold">{metrics.longestSnake} blocks</div>
        </div>
        
        <div className="flex flex-col gap-1 bg-gray-800 p-3 rounded-lg">
          <div className="text-gray-400 text-sm flex items-center gap-1">
            <Apple className="h-4 w-4" />
            Food Eaten
          </div>
          <div className="text-xl font-bold">{metrics.foodEaten}</div>
        </div>
        
        <div className="flex flex-col gap-1 bg-gray-800 p-3 rounded-lg col-span-2">
          <div className="text-gray-400 text-sm flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Total Play Time
          </div>
          <div className="text-xl font-bold">{formatTime(metrics.timeElapsed)}</div>
        </div>
      </div>
    </div>
  );
};

export default GameMetrics;
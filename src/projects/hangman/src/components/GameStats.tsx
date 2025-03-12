import React from 'react';
import { 
  BarChart3, 
  Clock, 
  Trophy, 
  TrendingUp,
  Zap
} from 'lucide-react';

interface GameStatsProps {
  gameTime: number;
  score: number;
  gamesPlayed: number;
  gamesWon: number;
  streak: number;
  highScore: number;
}

const GameStats: React.FC<GameStatsProps> = ({
  gameTime,
  score,
  gamesPlayed,
  gamesWon,
  streak,
  highScore
}) => {
  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-4 mt-6">
      <h2 className="text-lg font-bold text-center text-hangman-primary mb-4 flex items-center justify-center">
        <BarChart3 className="w-5 h-5 mr-2" />
        Game Statistics
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center bg-gray-50 p-2 rounded">
          <Clock className="w-5 h-5 text-hangman-secondary mr-2" />
          <div>
            <p className="text-xs text-gray-500">Time</p>
            <p className="font-semibold text-hangman-primary">{formatTime(gameTime)}</p>
          </div>
        </div>
        
        <div className="flex items-center bg-gray-50 p-2 rounded">
          <div>
            <p className="text-xs text-gray-500">Score</p>
            <p className="font-semibold text-hangman-primary">{score}</p>
          </div>
        </div>
        
        <div className="flex items-center bg-gray-50 p-2 rounded">
          <Trophy className="w-5 h-5 text-hangman-secondary mr-2" />
          <div>
            <p className="text-xs text-gray-500">Win Rate</p>
            <p className="font-semibold text-hangman-primary">
              {gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0}%
            </p>
          </div>
        </div>
        
        <div className="flex items-center bg-gray-50 p-2 rounded">
          <TrendingUp className="w-5 h-5 text-hangman-secondary mr-2" />
          <div>
            <p className="text-xs text-gray-500">High Score</p>
            <p className="font-semibold text-hangman-primary">{highScore}</p>
          </div>
        </div>
        
        <div className="col-span-2 flex items-center bg-gray-50 p-2 rounded">
          <Zap className="w-5 h-5 text-hangman-accent mr-2" />
          <div className="w-full">
            <p className="text-xs text-gray-500">Current Streak</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div 
                className="bg-hangman-accent h-2.5 rounded-full" 
                style={{ width: `${Math.min(100, streak * 10)}%` }}
              ></div>
            </div>
            <p className="text-xs text-right mt-1 text-hangman-accent font-medium">{streak} wins</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;
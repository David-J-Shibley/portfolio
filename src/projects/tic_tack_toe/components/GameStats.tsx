import React from 'react';
import { GameStatsProps } from '../types/game';
import { cn } from '@/lib/utils';
import { Trophy, Award, Hash, Flame } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const GameStats: React.FC<GameStatsProps> = ({ 
  stats, 
}) => {
  const totalGames = stats.totalGames || 1; // Avoid division by zero
  const xWinPercentage = Math.round((stats.xWins / totalGames) * 100) || 0;
  const oWinPercentage = Math.round((stats.oWins / totalGames) * 100) || 0;
  const drawPercentage = Math.round((stats.draws / totalGames) * 100) || 0;

  return (
    <div className="glass-panel rounded-2xl p-4 shadow-lg">
      <h2 className="text-xl font-semibold text-center mb-6">Game Statistics</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={cn(
          "stats-card",
          stats.lastWinner === 'X' && "ring-2 ring-game-x/30"
        )}>
          <div className="text-2xl font-bold text-game-x mb-1">X</div>
          <div className="text-3xl font-bold">{stats.xWins}</div>
          <div className="text-sm text-muted-foreground">wins</div>
        </div>
        
        <div className={cn(
          "stats-card",
          stats.lastWinner === 'O' && "ring-2 ring-game-o/30"
        )}>
          <div className="text-2xl font-bold text-game-o mb-1">O</div>
          <div className="text-3xl font-bold">{stats.oWins}</div>
          <div className="text-sm text-muted-foreground">wins</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="stats-card">
          <Hash className="mb-1 text-muted-foreground" size={18} />
          <div className="text-3xl font-bold">{stats.draws}</div>
          <div className="text-sm text-muted-foreground">draws</div>
        </div>
        
        <div className="stats-card">
          <Trophy className="mb-1 text-amber-500" size={18} />
          <div className="text-3xl font-bold">{stats.totalGames}</div>
          <div className="text-sm text-muted-foreground">total games</div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm">Win Rate (X)</span>
        <span className="text-sm font-medium">{xWinPercentage}%</span>
      </div>
      <Progress className="h-2 mb-3" value={xWinPercentage} />
      
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm">Win Rate (O)</span>
        <span className="text-sm font-medium">{oWinPercentage}%</span>
      </div>
      <Progress className="h-2 mb-3" value={oWinPercentage} />
      
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm">Draw Rate</span>
        <span className="text-sm font-medium">{drawPercentage}%</span>
      </div>
      <Progress className="h-2 mb-4" value={drawPercentage} />
      
      <div className="stats-card flex-row justify-between p-3 mt-4">
        <div className="flex items-center">
          <Flame className="text-orange-500 mr-2" size={20} />
          <span className="text-sm">Current Streak</span>
        </div>
        <div className="text-xl font-bold">{stats.currentStreak}</div>
      </div>
      
      <div className="stats-card flex-row justify-between p-3 mt-3">
        <div className="flex items-center">
          <Award className="text-amber-500 mr-2" size={20} />
          <span className="text-sm">Best Streak</span>
        </div>
        <div className="text-xl font-bold">{stats.longestStreak}</div>
      </div>
    </div>
  );
};

export default GameStats;
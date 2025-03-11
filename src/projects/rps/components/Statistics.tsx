import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, XCircle, MinusCircle, BarChart } from 'lucide-react';

const Statistics: React.FC = () => {
  const { gameState } = useGame();
  const { stats } = gameState;

  const StatItem = ({ 
    icon, 
    value, 
    label, 
    color = 'text-primary'
  }: { 
    icon: React.ReactNode, 
    value: number, 
    label: string,
    color?: string
  }) => (
    <div className="text-center">
      <div className={`flex justify-center ${color}`}>
        {icon}
      </div>
      <p className="stat-number">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  );

  // If no games have been played yet
  if (stats.totalGames === 0) {
    return (
      <div className="glass-morphism rounded-xl p-6">
        <h2 className="text-lg font-medium flex items-center mb-4">
          <BarChart className="h-4 w-4 mr-2" />
          Statistics
        </h2>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Play some games to see your stats</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-morphism rounded-xl p-6">
      <h2 className="text-lg font-medium flex items-center mb-6">
        <BarChart className="h-4 w-4 mr-2" />
        Statistics
      </h2>
      
      <div className="grid grid-cols-4 gap-4">
        <StatItem 
          icon={<Trophy className="h-5 w-5" />} 
          value={stats.wins} 
          label="Wins"
          color="text-green-500"
        />
        <StatItem 
          icon={<XCircle className="h-5 w-5" />} 
          value={stats.losses} 
          label="Losses"
          color="text-red-500"
        />
        <StatItem 
          icon={<MinusCircle className="h-5 w-5" />} 
          value={stats.draws} 
          label="Draws"
          color="text-yellow-500"
        />
        <div className="text-center">
          <div className="h-5 mb-1"></div>
          <p className="stat-number">{stats.winPercentage}%</p>
          <p className="stat-label">Win Rate</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
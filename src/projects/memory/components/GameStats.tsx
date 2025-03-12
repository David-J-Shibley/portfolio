import { motion } from 'framer-motion';
import { BarChart2, Clock, Trophy, Award } from 'lucide-react';

interface GameStatsProps {
  gamesPlayed: number;
  bestTime: number;
  bestScore: number;
  totalMatches: number;
}

const GameStats = ({ gamesPlayed, bestTime, bestScore, totalMatches }: GameStatsProps) => {
  // Format time in minutes and seconds
  const formatTime = (seconds: number) => {
    if (seconds === Infinity || seconds === 0) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const statItems = [
    { 
      icon: <Trophy className="w-5 h-5 text-amber-500" />, 
      label: "Games Played", 
      value: gamesPlayed.toString() 
    },
    { 
      icon: <Clock className="w-5 h-5 text-blue-500" />, 
      label: "Best Time", 
      value: formatTime(bestTime) 
    },
    { 
      icon: <BarChart2 className="w-5 h-5 text-purple-500" />, 
      label: "Best Score", 
      value: bestScore === Infinity ? '--' : bestScore 
    },
    { 
      icon: <Award className="w-5 h-5 text-green-500" />, 
      label: "Total Matches", 
      value: totalMatches.toString() 
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
          >
            <div className="flex items-center mb-2">
              {item.icon}
              <h3 className="text-xs font-medium text-slate-500 ml-2">{item.label}</h3>
            </div>
            <p className="text-2xl font-semibold">{item.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GameStats;
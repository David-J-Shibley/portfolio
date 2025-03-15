import React from 'react';
import { Player } from '../types/game';
import { Car, ShoppingBag, Dog, Ship, Shirt, Footprints, Sailboat, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerPieceProps {
  player: Player;
  small?: boolean;
}

const PlayerPiece: React.FC<PlayerPieceProps> = ({ player, small = false }) => {
  // Map token to icon and color
  const getTokenIcon = () => {
    const size = small ? 16 : 24;
    const commonProps = { 
      size,
      className: cn("animate-bounce", player.status === "jailed" && "opacity-50")
    };
    
    switch (player.token) {
      case 'car':
        return <Car {...commonProps} className={cn(commonProps.className, "text-blue-600")} />;
      case 'shoe':
        return <Footprints {...commonProps} className={cn(commonProps.className, "text-red-600")} />;
      case 'hat':
        return <Shirt {...commonProps} className={cn(commonProps.className, "text-purple-600")} />;
      case 'dog':
        return <Dog {...commonProps} className={cn(commonProps.className, "text-green-600")} />;
      case 'ship':
        return <Ship {...commonProps} className={cn(commonProps.className, "text-yellow-600")} />;
      case 'iron':
        return <Wrench {...commonProps} className={cn(commonProps.className, "text-gray-600")} />;
      case 'thimble':
        return <ShoppingBag {...commonProps} className={cn(commonProps.className, "text-pink-600")} />;
      case 'wheelbarrow':
        return <Sailboat {...commonProps} className={cn(commonProps.className, "text-orange-600")} />;
      default:
        return <Car {...commonProps} className={cn(commonProps.className, "text-blue-600")} />;
    }
  };
  
  return (
    <div className={cn(
      "flex items-center justify-center",
      small ? "w-4 h-4" : "w-8 h-8",
      player.status === "bankrupt" && "opacity-50"
    )}>
      {getTokenIcon()}
    </div>
  );
};

export default PlayerPiece;
import { Rocket, Shield } from 'lucide-react';

type SpaceShipProps = {
  style: React.CSSProperties;
};

export const SpaceShip = ({ style }: SpaceShipProps) => {
  return (
    <div style={style} className="relative">
      <div className="absolute inset-0 flex items-center justify-center text-space-player animate-pulse-glow glow-player">
        <Rocket size={40} strokeWidth={2.5} className="transform rotate-180" />
      </div>
    </div>
  );
};
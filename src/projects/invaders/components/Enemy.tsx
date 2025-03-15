
import { Skull } from 'lucide-react';

type EnemyProps = {
  style: React.CSSProperties;
};

export const Enemy = ({ style }: EnemyProps) => {
  return (
    <div style={style} className="relative">
      <div className="absolute inset-0 flex items-center justify-center text-space-enemy animate-enemy-hover glow-enemy">
        <Skull size={30} strokeWidth={2} />
      </div>
    </div>
  );
};


type ProjectileProps = {
    style: React.CSSProperties;
    isEnemy: boolean;
  };
  
  export const Projectile = ({ style, isEnemy }: ProjectileProps) => {
    return (
      <div 
        style={style} 
        className={`${isEnemy ? 'bg-space-enemy glow-enemy' : 'bg-space-laser glow-laser'} rounded-sm`} 
      />
    );
  };
  
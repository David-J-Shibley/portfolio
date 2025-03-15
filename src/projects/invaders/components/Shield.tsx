type ShieldProps = {
    style: React.CSSProperties;
    health: number;
  };
  
  export const Shield = ({ style, health }: ShieldProps) => {
    const getOpacity = () => {
      switch (health) {
        case 3:
          return 'opacity-100';
        case 2:
          return 'opacity-75';
        case 1:
          return 'opacity-40';
        default:
          return 'opacity-0';
      }
    };
  
    return (
      <div 
        style={style} 
        className={`bg-space-player rounded-sm ${getOpacity()}`} 
      />
    );
  };
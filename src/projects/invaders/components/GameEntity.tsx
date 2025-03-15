import { Entity } from '../types/game';
import { Shield } from './Shield';
import { SpaceShip } from './SpaceShip';
import { Enemy } from './Enemy';
import { Projectile } from './Projectile';

type GameEntityProps = {
  entity: Entity;
};

const GameEntity = ({ entity }: GameEntityProps) => {
  const style = {
    position: 'absolute',
    left: `${entity.position.x}px`,
    top: `${entity.position.y}px`,
    width: `${entity.size.width}px`,
    height: `${entity.size.height}px`,
  } as React.CSSProperties;

  switch (entity.type) {
    case 'player':
      return <SpaceShip style={style} />;
    case 'enemy':
      return <Enemy style={style} />;
    case 'projectile':
      return <Projectile style={style} isEnemy={entity.position.y > 0} />;
    case 'shield':
      return <Shield style={style} health={entity.health || 0} />;
    default:
      return null;
  }
};

export default GameEntity;

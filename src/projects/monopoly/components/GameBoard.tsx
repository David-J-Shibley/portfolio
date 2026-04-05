import React from 'react';
import { useGame } from '../context/GameContext';
import { BoardSpace, PropertyColor } from '../types/game';
import { cn } from '@/lib/utils';
import PlayerPiece from './PlayerPiece';

interface BoardSpaceProps {
  space: BoardSpace;
  isCorner?: boolean;
}

const BoardSpaceComponent: React.FC<BoardSpaceProps> = ({ space, isCorner = false }) => {
  const { state } = useGame();
  
  // Find any property data associated with this space
  const property = space.propertyId 
    ? state.properties.find(p => p.id === space.propertyId) 
    : null;
  
  // Get any players on this space
  const playersOnSpace = state.players.filter(p => 
    p.position === space.position && p.status !== 'bankrupt'
  );
  
  // Determine color bar based on property type
  const getColorClass = (color: PropertyColor) => {
    switch (color) {
      case 'brown': return 'bg-monopoly-brown';
      case 'lightBlue': return 'bg-monopoly-lightBlue';
      case 'pink': return 'bg-monopoly-pink';
      case 'orange': return 'bg-monopoly-orange';
      case 'red': return 'bg-monopoly-red';
      case 'yellow': return 'bg-monopoly-yellow';
      case 'green': return 'bg-monopoly-green';
      case 'darkBlue': return 'bg-monopoly-darkBlue';
      case 'railroad': return 'bg-monopoly-railroad';
      case 'utility': return 'bg-monopoly-utility';
      default: return 'bg-gray-200';
    }
  };
  
  // Determine space style based on type
  const getSpaceStyle = () => {
    if (isCorner) {
      return 'col-span-2 row-span-2 border-2 border-gray-300 flex items-center justify-center';
    }
    
    if (space.position < 10) { // Bottom row
      return 'h-20 border-2 border-gray-300 flex flex-col';
    } else if (space.position < 20) { // Left column
      return 'w-20 border-2 border-gray-300 flex flex-row-reverse';
    } else if (space.position < 30) { // Top row
      return 'h-20 border-2 border-gray-300 flex flex-col-reverse';
    } else { // Right column
      return 'w-20 border-2 border-gray-300 flex';
    }
  };
  
  // Function to render space content based on its type
  const renderSpaceContent = () => {
    if (isCorner) {
      switch (space.position) {
        case 0: return <div className="transform rotate-45 text-xl font-bold">GO</div>;
        case 10: return <div className="text-xl font-bold">JAIL</div>;
        case 20: return <div className="text-xl font-bold">FREE PARKING</div>;
        case 30: return <div className="text-xl font-bold">GO TO JAIL</div>;
      }
    }
    
    if (property) {
      const colorBar = getColorClass(property.color);
      const ownerPlayer = property.owner !== null ? state.players.find(p => p.id === property.owner) : null;
      const ownerIndicator = ownerPlayer
        ? <div className="w-4 h-4 rounded-full absolute" style={{ background: property.status === 'mortgaged' ? '#aaa' : ownerPlayer.color, opacity: 0.8, border: '2px solid #fff', right: 0, top: 0 }}></div>
        : null;
      const ownedHighlight = ownerPlayer ? { boxShadow: `0 0 0 3px ${ownerPlayer.color}99` } : {};
      
      if (space.position < 10) { // Bottom row
        return (
          <div style={ownedHighlight} className="relative h-full w-full">
            <div className={`w-full h-5 ${colorBar}`}></div>
            <div className="flex-1 p-1 text-[10px] font-medium">{property.name}</div>
            <div className="text-[10px] font-bold p-1">${property.price}</div>
            {ownerIndicator && <div className="absolute top-1 right-1">{ownerIndicator}</div>}
          </div>
        );
      } else if (space.position < 20) { // Left column
        return (
          <div style={ownedHighlight} className="relative h-full w-full">
            <div className={`h-full w-5 ${colorBar}`}></div>
            <div className="flex-1 p-1 text-[10px] font-medium transform rotate-90">{property.name}</div>
            <div className="text-[10px] font-bold p-1 transform rotate-90">${property.price}</div>
            {ownerIndicator && <div className="absolute top-1 right-1">{ownerIndicator}</div>}
          </div>
        );
      } else if (space.position < 30) { // Top row
        return (
          <div style={ownedHighlight} className="relative h-full w-full">
            <div className={`w-full h-5 ${colorBar}`}></div>
            <div className="flex-1 p-1 text-[10px] font-medium">{property.name}</div>
            <div className="text-[10px] font-bold p-1">${property.price}</div>
            {ownerIndicator && <div className="absolute top-1 right-1">{ownerIndicator}</div>}
          </div>
        );
      } else { // Right column
        return (
          <div style={ownedHighlight} className="relative h-full w-full">
            <div className={`h-full w-5 ${colorBar}`}></div>
            <div className="flex-1 p-1 text-[10px] font-medium transform -rotate-90">{property.name}</div>
            <div className="text-[10px] font-bold p-1 transform -rotate-90">${property.price}</div>
            {ownerIndicator && <div className="absolute top-1 right-1">{ownerIndicator}</div>}
          </div>
        );
      }
    } else {
      // For non-property spaces
      if (space.position < 10) { // Bottom row
        return <div className="w-full text-center text-[10px] font-medium p-1">{space.name}</div>;
      } else if (space.position < 20) { // Left column
        return <div className="h-full text-center text-[10px] font-medium p-1 transform rotate-90">{space.name}</div>;
      } else if (space.position < 30) { // Top row
        return <div className="w-full text-center text-[10px] font-medium p-1">{space.name}</div>;
      } else { // Right column
        return <div className="h-full text-center text-[10px] font-medium p-1 transform -rotate-90">{space.name}</div>;
      }
    }
  };
  
  return (
    <div className={cn(getSpaceStyle(), "relative")}>
      {renderSpaceContent()}
      
      {/* Show player pieces */}
      {playersOnSpace.length > 0 && (
        <div className={cn(
          "absolute flex flex-wrap gap-1",
          isCorner ? "bottom-1 right-1" :
            space.position < 10 ? "top-1 left-1" :
            space.position < 20 ? "top-1 left-1" :
            space.position < 30 ? "bottom-1 right-1" :
            "bottom-1 right-1"
        )}>
          {playersOnSpace.map(player => (
            <PlayerPiece key={player.id} player={player} small />
          ))}
        </div>
      )}
    </div>
  );
};

const gridCell = "relative z-0 min-h-0 min-w-0";

const GameBoard: React.FC = () => {
  const { state } = useGame();

  return (
    <div className="w-full max-w-[min(100vw-2rem,520px)] shrink-0 aspect-square overflow-hidden rounded-lg border-4 border-monopoly-green bg-white shadow-xl dark:bg-zinc-900">
      <div
        className="grid h-full w-full"
        style={{
          gridTemplateColumns: "repeat(11, minmax(0, 1fr))",
          gridTemplateRows: "repeat(11, minmax(0, 1fr))",
        }}
      >
        {/* Top row (spaces 21–29) — JIT cannot build col-start-${n}; use inline grid placement */}
        {state.boardSpaces.slice(21, 30).map((space, index) => (
          <div
            key={space.id}
            className={gridCell}
            style={{ gridColumn: index + 3, gridRow: 1 }}
          >
            <BoardSpaceComponent space={space} />
          </div>
        ))}

        {state.boardSpaces
          .slice(31, 40)
          .reverse()
          .map((space, index) => (
            <div
              key={space.id}
              className={gridCell}
              style={{ gridColumn: 11, gridRow: index + 3 }}
            >
              <BoardSpaceComponent space={space} />
            </div>
          ))}

        {state.boardSpaces.slice(1, 10).map((space, index) => (
          <div
            key={space.id}
            className={gridCell}
            style={{ gridColumn: 10 - index, gridRow: 11 }}
          >
            <BoardSpaceComponent space={space} />
          </div>
        ))}

        {state.boardSpaces
          .slice(11, 20)
          .reverse()
          .map((space, index) => (
            <div
              key={space.id}
              className={gridCell}
              style={{ gridColumn: 1, gridRow: 10 - index }}
            >
              <BoardSpaceComponent space={space} />
            </div>
          ))}

        {/* Corners on top so overlapping edge cells don’t hide them */}
        <div
          className={`${gridCell} z-10`}
          style={{ gridColumn: "1 / span 2", gridRow: "1 / span 2" }}
        >
          <BoardSpaceComponent space={state.boardSpaces[20]} isCorner />
        </div>
        <div
          className={`${gridCell} z-10`}
          style={{ gridColumn: "1 / span 2", gridRow: "10 / span 2" }}
        >
          <BoardSpaceComponent space={state.boardSpaces[10]} isCorner />
        </div>
        <div
          className={`${gridCell} z-10`}
          style={{ gridColumn: "10 / span 2", gridRow: "10 / span 2" }}
        >
          <BoardSpaceComponent space={state.boardSpaces[0]} isCorner />
        </div>
        <div
          className={`${gridCell} z-10`}
          style={{ gridColumn: "10 / span 2", gridRow: "1 / span 2" }}
        >
          <BoardSpaceComponent space={state.boardSpaces[30]} isCorner />
        </div>

        <div
          className="relative z-[1] flex items-center justify-center bg-emerald-50/40 dark:bg-emerald-950/30"
          style={{ gridColumn: "3 / span 7", gridRow: "3 / span 7" }}
        >
          <span className="select-none text-2xl font-extrabold text-monopoly-green/25 sm:text-4xl md:text-6xl">
            MONOPOLY
          </span>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
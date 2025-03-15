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
      const ownerIndicator = property.owner !== null 
        ? <div className={`w-4 h-4 rounded-full absolute ${property.status === 'mortgaged' ? 'bg-gray-400' : `bg-${state.players.find(p => p.id === property.owner)?.token}-500`}`}></div>
        : null;
      
      if (space.position < 10) { // Bottom row
        return (
          <>
            <div className={`w-full h-5 ${colorBar}`}></div>
            <div className="flex-1 p-1 text-[10px] font-medium">{property.name}</div>
            <div className="text-[10px] font-bold p-1">${property.price}</div>
            {ownerIndicator && <div className="absolute top-1 right-1">{ownerIndicator}</div>}
          </>
        );
      } else if (space.position < 20) { // Left column
        return (
          <>
            <div className={`h-full w-5 ${colorBar}`}></div>
            <div className="flex-1 p-1 text-[10px] font-medium transform rotate-90">{property.name}</div>
            <div className="text-[10px] font-bold p-1 transform rotate-90">${property.price}</div>
            {ownerIndicator && <div className="absolute top-1 right-1">{ownerIndicator}</div>}
          </>
        );
      } else if (space.position < 30) { // Top row
        return (
          <>
            <div className={`w-full h-5 ${colorBar}`}></div>
            <div className="flex-1 p-1 text-[10px] font-medium">{property.name}</div>
            <div className="text-[10px] font-bold p-1">${property.price}</div>
            {ownerIndicator && <div className="absolute top-1 right-1">{ownerIndicator}</div>}
          </>
        );
      } else { // Right column
        return (
          <>
            <div className={`h-full w-5 ${colorBar}`}></div>
            <div className="flex-1 p-1 text-[10px] font-medium transform -rotate-90">{property.name}</div>
            <div className="text-[10px] font-bold p-1 transform -rotate-90">${property.price}</div>
            {ownerIndicator && <div className="absolute top-1 right-1">{ownerIndicator}</div>}
          </>
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

const GameBoard: React.FC = () => {
  const { state } = useGame();
  
  // Create the grid layout for the board
  return (
<div className="w-full max-w-3xl h-full max-h-[90vh] aspect-square bg-white border-4 border-monopoly-green shadow-xl">
  <div className="grid grid-cols-11 grid-rows-11 h-full w-full">

    {/* Top Row (spaces 21-29) */}
    {state.boardSpaces.slice(21, 30).map((space, index) => (
      <div key={space.id} className={`col-start-${index + 2} row-start-1`}>
        <BoardSpaceComponent space={space} />
      </div>
    ))}

    {/* Right Column (spaces 31-39) */}
    {state.boardSpaces.slice(31, 40).map((space, index) => (
      <div key={space.id} className={`col-start-11 row-start-${index + 2}`}>
        <BoardSpaceComponent space={space} />
      </div>
    ))}

    {/* Bottom Row (spaces 1-9) */}
    {state.boardSpaces.slice(1, 10).map((space, index) => (
      <div key={space.id} className={`col-start-${10 - index} row-start-11`}>
        <BoardSpaceComponent space={space} />
      </div>
    ))}

    {/* Left Column (spaces 11-19) */}
    {state.boardSpaces.slice(11, 20).reverse().map((space, index) => (
      <div key={space.id} className={`col-start-1 row-start-${10 - index}`}>
        <BoardSpaceComponent space={space} />
      </div>
    ))}

    {/* Corners */}
    <div className="col-start-1 row-start-1">
      <BoardSpaceComponent space={state.boardSpaces[20]} isCorner={true} />
    </div>
    <div className="col-start-1 row-start-11">
      <BoardSpaceComponent space={state.boardSpaces[10]} isCorner={true} />
    </div>
    <div className="col-start-11 row-start-11">
      <BoardSpaceComponent space={state.boardSpaces[0]} isCorner={true} />
    </div>
    <div className="col-start-11 row-start-1">
      <BoardSpaceComponent space={state.boardSpaces[30]} isCorner={true} />
    </div>

    {/* Center MONOPOLY Square */}
    <div className="col-start-2 col-span-9 row-start-2 row-span-9 bg-monopoly-lightGreen flex items-center justify-center p-4">
      <div className="transform -rotate-45 text-4xl font-bold text-monopoly-green">MONOPOLY</div>
    </div>

  </div>
</div>
  );
};

export default GameBoard;
import React from 'react';
import { GameProvider, useGame } from '../context/GameContext';
import CharacterCreation from '../components/CharacterCreation';
import GameInterface from '../components/GameInterface';
import LevelMap from '../components/LevelMap';
import Inventory from '../components/Inventory';
import Shop from '../components/Shop';
import CombatScreen from '../components/CombatScreen';

import './index.css'

// Game wrapper component
const Game: React.FC = () => {
  const { character, gameScreen } = useGame();

  return (
    <div className="game-container">
      <div className="game-content">
        {/* Render different screens based on game state */}
        {!character && gameScreen === 'start' && <CharacterCreation />}
        
        {character && (
          <>
            {gameScreen === 'world' && (
              <>
                <GameInterface />
                <LevelMap />
              </>
            )}
            
            {gameScreen === 'inventory' && <Inventory />}
            {gameScreen === 'shop' && <Shop />}
            {gameScreen === 'combat' && <CombatScreen />}
          </>
        )}
      </div>
    </div>
  );
};

// Index page with provider
const Index: React.FC = () => {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
};

export default Index;

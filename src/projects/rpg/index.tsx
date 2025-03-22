import React, { useState, useEffect } from 'react';

// Type definitions
type CharacterClass = 'warrior' | 'rogue' | 'mage';
type GameState = 'characterCreation' | 'exploration' | 'combat' | 'shop' | 'inventory' | 'gameOver';

interface Item {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: {
    maxHealth?: number;
    attack?: number;
    defense?: number;
  };
  isEquipped: boolean;
}

interface Character {
  name: string;
  class: CharacterClass;
  level: number;
  maxHealth: number;
  health: number;
  attack: number;
  defense: number;
  experience: number;
  gold: number;
  inventory: Item[];
}

interface Enemy {
  name: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  experienceReward: number;
  goldReward: number;
}

interface SaveData {
  character: Character;
  timestamp: number;
}

const SAVE_KEY = 'typescript-rpg-save';

const RPGGame: React.FC = () => {
  // Game states
  const [gameState, setGameState] = useState<GameState>('characterCreation');
  const [message, setMessage] = useState<string>('Welcome to the TypeScript RPG! Create your character to begin.');
  const [hasSaveData, setHasSaveData] = useState<boolean>(false);
  
  // Character stats
  const [character, setCharacter] = useState<Character>({
    name: '',
    class: 'warrior',
    level: 1,
    maxHealth: 100,
    health: 100,
    attack: 10,
    defense: 5,
    experience: 0,
    gold: 50, // Starting with some gold to try the shop
    inventory: []
  });
  
  // Enemy data
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  
  // Check for saved game on initial load
  useEffect(() => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      setHasSaveData(true);
    }
  }, []);
  
  const enemies: Enemy[] = [
    { name: 'Goblin', health: 30, maxHealth: 30, attack: 5, defense: 2, experienceReward: 20, goldReward: 5 },
    { name: 'Wolf', health: 25, maxHealth: 25, attack: 7, defense: 1, experienceReward: 15, goldReward: 3 },
    { name: 'Skeleton', health: 40, maxHealth: 40, attack: 6, defense: 3, experienceReward: 25, goldReward: 8 },
    { name: 'Orc', health: 60, maxHealth: 60, attack: 8, defense: 4, experienceReward: 35, goldReward: 12 },
    { name: 'Troll', health: 100, maxHealth: 100, attack: 12, defense: 6, experienceReward: 50, goldReward: 20 },
    
    // New tougher enemies
    { name: 'Dark Knight', health: 120, maxHealth: 120, attack: 15, defense: 8, experienceReward: 80, goldReward: 40 },
    { name: 'Fire Elemental', health: 90, maxHealth: 90, attack: 20, defense: 4, experienceReward: 75, goldReward: 30 },
    { name: 'Vampire', health: 110, maxHealth: 110, attack: 18, defense: 7, experienceReward: 90, goldReward: 50 },
    { name: 'Wyvern', health: 150, maxHealth: 150, attack: 22, defense: 10, experienceReward: 100, goldReward: 60 },
    
    // Boss-tier enemies
    { name: 'Lich King', health: 200, maxHealth: 200, attack: 25, defense: 12, experienceReward: 150, goldReward: 100 },
    { name: 'Demon Lord', health: 300, maxHealth: 300, attack: 30, defense: 15, experienceReward: 200, goldReward: 150 },
    { name: 'Ancient Dragon', health: 400, maxHealth: 400, attack: 35, defense: 20, experienceReward: 300, goldReward: 250 }
  ];

  // Shop items
  const shopItems: Item[] = [
    { 
      id: 'health-potion', 
      name: 'Health Potion', 
      description: 'Restores 50 health points immediately',
      cost: 15,
      effect: { maxHealth: 0 },
      isEquipped: false
    },
    { 
      id: 'iron-sword', 
      name: 'Iron Sword', 
      description: 'Increases attack by 5',
      cost: 40,
      effect: { attack: 5 },
      isEquipped: false
    },
    { 
      id: 'leather-armor', 
      name: 'Leather Armor', 
      description: 'Increases defense by 3',
      cost: 30,
      effect: { defense: 3 },
      isEquipped: false
    },
    { 
      id: 'steel-shield', 
      name: 'Steel Shield', 
      description: 'Increases defense by 5',
      cost: 60,
      effect: { defense: 5 },
      isEquipped: false
    },
    { 
      id: 'enchanted-amulet', 
      name: 'Enchanted Amulet', 
      description: 'Increases max health by 20',
      cost: 50,
      effect: { maxHealth: 20 },
      isEquipped: false
    },
    { 
      id: 'battle-axe', 
      name: 'Battle Axe', 
      description: 'Increases attack by 8',
      cost: 75,
      effect: { attack: 8 },
      isEquipped: false
    },
    { 
        id: 'dragon-blade', 
        name: 'Dragon Blade', 
        description: 'A sword infused with dragon fire. Increases attack by 15',
        cost: 150,
        effect: { attack: 15 },
        isEquipped: false
      },
      { 
        id: 'mythril-armor', 
        name: 'Mythril Armor', 
        description: 'Light yet strong. Increases defense by 10',
        cost: 120,
        effect: { defense: 10 },
        isEquipped: false
      },
      { 
        id: 'titan-shield', 
        name: 'Titan Shield', 
        description: 'Unbreakable defense. Increases defense by 15',
        cost: 180,
        effect: { defense: 15 },
        isEquipped: false
      },
      { 
        id: 'orb-of-chaos', 
        name: 'Orb of Chaos', 
        description: 'Grants immense power but unpredictable effects (+20 attack, +10 defense, -10 max health)',
        cost: 250,
        effect: { attack: 20, defense: 10, maxHealth: -10 },
        isEquipped: false
      },
      { 
        id: 'elixir-of-eternity', 
        name: 'Elixir of Eternity', 
        description: 'Permanently increases max health by 50',
        cost: 300,
        effect: { maxHealth: 50 },
        isEquipped: false
      }
  ];
  
  // Save and Load functionality
  const saveGame = () => {
    const saveData: SaveData = {
      character: character,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      setMessage("Game saved successfully!");
    } catch (error) {
      setMessage("Error saving game. Local storage may be full or disabled.");
    }
  };
  
  const loadGame = () => {
    try {
      const savedData = localStorage.getItem(SAVE_KEY);
      if (savedData) {
        const parsedData: SaveData = JSON.parse(savedData);
        setCharacter(parsedData.character);
        setGameState('exploration');
        
        // Format date for the message
        const saveDate = new Date(parsedData.timestamp);
        const formattedDate = saveDate.toLocaleString();
        
        setMessage(`Game loaded successfully! Last saved: ${formattedDate}`);
      }
    } catch (error) {
      setMessage("Error loading saved game.");
    }
  };
  
  const deleteSave = () => {
    try {
      localStorage.removeItem(SAVE_KEY);
      setHasSaveData(false);
      setMessage("Save file deleted.");
    } catch (error) {
      setMessage("Error deleting save file.");
    }
  };
  
  // Handle character creation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCharacter({ ...character, name: e.target.value });
  };
  
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const characterClass = e.target.value as CharacterClass;
    let stats = { ...character, class: characterClass };
    
    // Adjust stats based on class
    if (characterClass === 'warrior') {
      stats = { ...stats, maxHealth: 120, health: 120, attack: 12, defense: 8 };
    } else if (characterClass === 'rogue') {
      stats = { ...stats, maxHealth: 80, health: 80, attack: 15, defense: 4 };
    } else if (characterClass === 'mage') {
      stats = { ...stats, maxHealth: 70, health: 70, attack: 18, defense: 2 };
    }
    
    setCharacter(stats);
  };
  
  const startGame = () => {
    if (!character.name.trim()) {
      setMessage('Please enter a character name!');
      return;
    }
    
    setMessage(`${character.name} the ${character.class} begins their adventure!`);
    setGameState('exploration');
  };
  
  // Exploration actions
  const exploreArea = () => {
    const randomEvent = Math.random();
    
    if (randomEvent < 0.7) { // 70% chance to encounter an enemy
      startCombat();
    } else if (randomEvent < 0.9) { // 20% chance to find treasure
      findTreasure();
    } else { // 10% chance to rest
      rest();
    }
  };
  
  const startCombat = () => {
    let enemyIndex = 0; 
    while (enemyIndex > enemies.length - 1|| enemyIndex <= 0) {
     enemyIndex = Math.floor(Math.random() * enemies.length / character.level * 2)   
    }
    console.log('enemy index', enemyIndex)
    const enemy = { ...enemies[enemyIndex] }; // Clone enemy to avoid modifying the template
    
    setCurrentEnemy(enemy);
    setMessage(`You encountered a ${enemy.name}!`);
    setGameState('combat');
  };
  
  const findTreasure = () => {
    const goldFound = Math.floor(Math.random() * 10) + 5;
    setCharacter({
      ...character,
      gold: character.gold + goldFound
    });
    setMessage(`You found ${goldFound} gold!`);
  };
  
  const rest = () => {
    const healAmount = Math.floor(character.maxHealth * 0.3);
    const newHealth = Math.min(character.health + healAmount, character.maxHealth);
    
    setCharacter({
      ...character,
      health: newHealth
    });
    
    setMessage(`You take a short rest and recover ${newHealth - character.health} health.`);
  };
  
  // Combat actions
  const attack = () => {
    if (!currentEnemy) return;
    
    // Player attacks enemy
    const damage = Math.max(Math.floor(character.attack * (Math.random() * 0.5 + 0.75) - currentEnemy.defense), 1);
    const enemyNewHealth = Math.max(currentEnemy.health - damage, 0);
    
    let newMessage = `You hit the ${currentEnemy.name} for ${damage} damage!`;
    
    setCurrentEnemy({
      ...currentEnemy,
      health: enemyNewHealth
    });
    
    // Check if enemy is defeated
    if (enemyNewHealth <= 0) {
      return endCombat(true);
    }
    
    // Enemy counter-attacks
    const enemyDamage = Math.max(Math.floor(currentEnemy.attack * (Math.random() * 0.5 + 0.75) - character.defense), 1);
    const playerNewHealth = Math.max(character.health - enemyDamage, 0);
    
    newMessage += ` The ${currentEnemy.name} hits you for ${enemyDamage} damage!`;
    
    setCharacter({
      ...character,
      health: playerNewHealth
    });
    
    setMessage(newMessage);
    
    // Check if player is defeated
    if (playerNewHealth <= 0) {
      return endCombat(false);
    }
  };
  
  const flee = () => {
    const fleeChance = Math.random();
    if (currentEnemy?.attack || 0 > character.health * 0.5) {
        setMessage(`You successfully fled from the ${currentEnemy?.name}!`);
        setCurrentEnemy(null);
        setGameState('exploration');
    }
    if (fleeChance < 0.6) { // 60% chance to successfully flee
      setMessage(`You successfully fled from the ${currentEnemy?.name}!`);
      setCurrentEnemy(null);
      setGameState('exploration');
    } else {
      // Failed to flee, enemy gets a free attack
      if (currentEnemy) {
        const enemyDamage = Math.max(Math.floor(currentEnemy.attack * (Math.random() * 0.5 + 0.75) - character.defense), 1);
        const playerNewHealth = Math.max(character.health - enemyDamage, 0);
        
        setCharacter({
          ...character,
          health: playerNewHealth
        });
        
        setMessage(`You failed to flee! The ${currentEnemy.name} hits you for ${enemyDamage} damage!`);
        
        // Check if player is defeated
        if (playerNewHealth <= 0) {
          return endCombat(false);
        }
      }
    }
  };
  
  const endCombat = (victory: boolean) => {
    if (victory && currentEnemy) {
      const { experienceReward, goldReward } = currentEnemy;
      const newExperience = character.experience + experienceReward;
      const levelUp = newExperience >= 100 * character.level;
      
      let updatedCharacter = {
        ...character,
        experience: levelUp ? newExperience - (100 * character.level) : newExperience,
        gold: character.gold + goldReward
      };
      
      if (levelUp) {
        updatedCharacter = {
          ...updatedCharacter,
          level: character.level + 1,
          maxHealth: Math.floor(character.maxHealth * 1.2),
          health: Math.floor(character.maxHealth * 1.2), // Full heal on level up
          attack: Math.floor(character.attack * 1.15),
          defense: Math.floor(character.defense * 1.15)
        };
        
        setMessage(`Victory! You defeated the ${currentEnemy.name} and gained ${experienceReward} experience and ${goldReward} gold! You leveled up to level ${updatedCharacter.level}!`);
      } else {
        setMessage(`Victory! You defeated the ${currentEnemy.name} and gained ${experienceReward} experience and ${goldReward} gold!`);
      }
      
      setCharacter(updatedCharacter);
      setCurrentEnemy(null);
      setGameState('exploration');
      
      // Auto-save after combat
      setTimeout(() => {
        saveGame();
      }, 500);
    } else if (currentEnemy) {
      setMessage(`You were defeated by the ${currentEnemy.name}. Game Over!`);
      setGameState('gameOver');
    }
  };
  
  // Shop functionality
  const visitShop = () => {
    setMessage("Welcome to the shop! What would you like to buy?");
    setGameState('shop');
  };
  
  const buyItem = (item: Item) => {
    // Check if player has enough gold
    if (character.gold < item.cost) {
      setMessage(`You don't have enough gold to buy ${item.name}!`);
      return;
    }
    
    // Check if the item is a one-time use item (like a health potion)
    if (item.id === 'health-potion') {
      // Apply health potion effect immediately
      const newHealth = Math.min(character.health + 50, character.maxHealth);
      setCharacter({
        ...character,
        gold: character.gold - item.cost,
        health: newHealth
      });
      setMessage(`You used a Health Potion and recovered health! (${character.health} → ${newHealth})`);
      return;
    }
    
    // Check if player already has this item
    const hasItem = character.inventory.some(invItem => invItem.id === item.id);
    if (hasItem) {
      setMessage(`You already own a ${item.name}!`);
      return;
    }
    
    // Add item to inventory
    const newInventory = [...character.inventory, { ...item, isEquipped: true }];
    
    // Calculate new stats with the item equipped
    let newMaxHealth = character.maxHealth;
    let newAttack = character.attack;
    let newDefense = character.defense;
    
    if (item.effect.maxHealth) {
      newMaxHealth += item.effect.maxHealth;
    }
    if (item.effect.attack) {
      newAttack += item.effect.attack;
    }
    if (item.effect.defense) {
      newDefense += item.effect.defense;
    }
    
    // Deduct gold and update character
    setCharacter({
      ...character,
      gold: character.gold - item.cost,
      maxHealth: newMaxHealth,
      health: character.health + (item.effect.maxHealth || 0), // Increase current health if max health increases
      attack: newAttack,
      defense: newDefense,
      inventory: newInventory
    });
    
    setMessage(`You purchased ${item.name} for ${item.cost} gold! Your stats have been updated.`);
    
    // Auto-save after purchase
    setTimeout(() => {
      saveGame();
    }, 500);
  };
  
  const viewInventory = () => {
    setMessage("Your inventory:");
    setGameState('inventory');
  };
  
  const restartGame = () => {
    setCharacter({
      name: '',
      class: 'warrior',
      level: 1,
      maxHealth: 100,
      health: 100,
      attack: 10,
      defense: 5,
      experience: 0,
      gold: 50,
      inventory: []
    });
    setCurrentEnemy(null);
    setMessage('Welcome to the TypeScript RPG! Create your character to begin.');
    setGameState('characterCreation');
  };
  
  // Render health bars
  const renderHealthBar = (current: number, max: number, entity: string) => {
    const percentage = (current / max) * 100;
    let colorClass = 'bg-green-500';
    
    if (percentage < 30) {
      colorClass = 'bg-red-500';
    } else if (percentage < 70) {
      colorClass = 'bg-yellow-500';
    }
    
    return (
      <div className="mt-2">
        <div className="flex justify-between text-sm">
          <span>{entity}</span>
          <span>{current}/{max} HP</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-4">
          <div
            className={`${colorClass} h-4 rounded-full`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };
  
  // Format save date
  const formatSaveDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">TypeScript RPG</h1>
      
      {/* Message box */}
      <div className="bg-white p-4 rounded mb-4 min-h-16 border border-gray-300">
        <p>{message}</p>
      </div>
      
      {/* Character Creation */}
      {gameState === 'characterCreation' && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Create Your Character</h2>
          
          <div className="mb-4">
            <label className="block mb-1">Character Name:</label>
            <input
              type="text"
              value={character.name}
              onChange={handleNameChange}
              className="w-full p-2 border rounded"
              placeholder="Enter name"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Character Class:</label>
            <select
              value={character.class}
              onChange={handleClassChange}
              className="w-full p-2 border rounded"
            >
              <option value="warrior">Warrior (High HP, Balanced)</option>
              <option value="rogue">Rogue (Fast, High Attack)</option>
              <option value="mage">Mage (Low HP, Very High Attack)</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-bold">Health: {character.health}</p>
              <p className="font-bold">Attack: {character.attack}</p>
            </div>
            <div>
              <p className="font-bold">Defense: {character.defense}</p>
              <p className="font-bold">Level: {character.level}</p>
            </div>
          </div>
          
          <button
            onClick={startGame}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mb-2"
          >
            Start New Adventure
          </button>
          
          {hasSaveData && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={loadGame}
                className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
              >
                Load Saved Game
              </button>
              <button
                onClick={deleteSave}
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
              >
                Delete Save
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Exploration */}
      {gameState === 'exploration' && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Exploration</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-bold">{character.name} the {character.class}</p>
              <p>Level: {character.level}</p>
              <p>Gold: {character.gold}</p>
            </div>
            <div>
              <p>EXP: {character.experience}/{100 * character.level}</p>
              <p>Attack: {character.attack}</p>
              <p>Defense: {character.defense}</p>
            </div>
          </div>
          
          {renderHealthBar(character.health, character.maxHealth, 'Health')}
          
          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              onClick={exploreArea}
              className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              Explore
            </button>
            <button
              onClick={visitShop}
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Shop
            </button>
            <button
              onClick={viewInventory}
              className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
            >
              Inventory
            </button>
          </div>
          
          <div className="mt-2">
            <button
              onClick={saveGame}
              className="w-full bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700"
            >
              Save Game
            </button>
          </div>
        </div>
      )}
      
      {/* Combat */}
      {gameState === 'combat' && currentEnemy && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Combat</h2>
          
          <div className="mb-4">
            <p className="font-bold text-red-600">{currentEnemy.name}</p>
            {renderHealthBar(currentEnemy.health, currentEnemy.maxHealth, currentEnemy.name)}
          </div>
          
          <div className="mb-4">
            <p className="font-bold text-blue-600">{character.name}</p>
            {renderHealthBar(character.health, character.maxHealth, 'You')}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={attack}
              className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
            >
              Attack
            </button>
            <button
              onClick={flee}
              className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
            >
              Flee
            </button>
          </div>
        </div>
      )}
      
      {/* Shop */}
      {gameState === 'shop' && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Shop</h2>
          <p className="mb-4">Your Gold: {character.gold}</p>
          
          <div className="space-y-3">
            {shopItems.map((item) => (
              <div key={item.id} className="border p-2 rounded flex justify-between items-center">
                <div>
                  <p className="font-bold">{item.name} - {item.cost} gold</p>
                  <p className="text-sm">{item.description}</p>
                </div>
                <button
                  onClick={() => buyItem(item)}
                  className="bg-yellow-600 text-white p-1 rounded hover:bg-yellow-700"
                  disabled={character.gold < item.cost || (item.id !== 'health-potion' && character.inventory.some(i => i.id === item.id))}
                >
                  Buy
                </button>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => setGameState('exploration')}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mt-4"
          >
            Back to Adventure
          </button>
        </div>
      )}
      
      {/* Inventory */}
      {gameState === 'inventory' && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Inventory</h2>
          
          {character.inventory.length === 0 ? (
            <p>Your inventory is empty.</p>
          ) : (
            <div className="space-y-3">
              {character.inventory.map((item) => (
                <div key={item.id} className="border p-2 rounded">
                  <p className="font-bold">{item.name} {item.isEquipped && '(Equipped)'}</p>
                  <p className="text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          )}
          
          <button
            onClick={() => setGameState('exploration')}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mt-4"
          >
            Back to Adventure
          </button>
        </div>
      )}
      
      {/* Game Over */}
      {gameState === 'gameOver' && (
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-2 text-red-600">Game Over</h2>
          <p>You reached level {character.level} and collected {character.gold} gold.</p>
          <p>Items collected: {character.inventory.length}</p>
          <button
            onClick={restartGame}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mt-4"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default RPGGame;
import { GameState } from "../types/gameTypes";
import { fossilData, dinosaurData } from "./fossilData";
import { GridCell, Rarity, DigSite, FossilPieceType, Fossil } from "../types/gameTypes";

export const getInitialGameState = (): GameState => {
  return {
    currentSite: {
      id: 'default',
      name: 'Default Site',
      description: 'A basic dig site with fossils and artifacts',
      difficulty: 'beginner',
      gridSize: 10,
      maxLayers: 3,
      energyCost: 10,
      fossilRarity: ['common', 'rare', 'legendary'],
      unlocked: true,
      imageUrl: 'https://via.placeholder.com/150'
    },
    excavationGrid: Array.from({ length: 10 }, (_, y) =>
      Array.from({ length: 10 }, (_, x) => ({
        x,
        y,
        layer: 1,
        maxLayers: 3,
        content: { type: 'empty' },
        isRevealed: false,
        isFlagged: false,
        excavationProgress: 0
      }))
    ),
    selectedTool: {
      id: 'brush',
      name: 'Brush',
      description: 'A basic tool for digging',
      energyCost: 1,
      precision: 1,
      durability: 100,
      maxDurability: 100,
      icon: '🖌️'
    },
    energy: 100,
    maxEnergy: 200,
    inventory: [],
    discoveredFossils: [],
    score: 0,
    level: 1,
    experience: 0,
    isPaused: false,
    gameOver: false,
    achievements: [],
    money: 0
  };
};

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function getRandomFossilByRarity(rarity: Rarity) {
  const fossils = fossilData.filter(f => f.rarity === rarity);
  if (fossils.length === 0) return null;
  return fossils[getRandomInt(fossils.length)];
}

export function placeEnergyCellsOnGrid(grid: GridCell[][], count = 3, amount = 10): GridCell[][] {
  const size = grid.length;
  const placed: Set<string> = new Set();
  let placedCount = 0;
  while (placedCount < count) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    const key = `${x},${y}`;
    if (grid[y][x].content.type !== "empty" || placed.has(key)) continue;
    grid[y][x] = {
      ...grid[y][x],
      content: { type: "energy", amount },
    };
    placed.add(key);
    placedCount++;
  }
  return grid;
}

export function placeMineralCellsOnGrid(grid: GridCell[][], count = 3, amount = 25): GridCell[][] {
  const size = grid.length;
  const placed: Set<string> = new Set();
  let placedCount = 0;
  while (placedCount < count) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    const key = `${x},${y}`;
    if (grid[y][x].content.type !== "empty" || placed.has(key)) continue;
    grid[y][x] = {
      ...grid[y][x],
      content: { type: "mineral", amount },
    };
    placed.add(key);
    placedCount++;
  }
  return grid;
}

export function placeFossilsOnGrid(grid: GridCell[][], fossilRarities: Rarity[], fossilCount = 5): GridCell[][] {
  const size = grid.length;
  const placed: Set<string> = new Set();
  let count = 0;
  while (count < fossilCount) {
    const x = getRandomInt(size);
    const y = getRandomInt(size);
    const key = `${x},${y}`;
    if (placed.has(key)) continue;
    // Pick a random rarity from allowed
    const rarity = fossilRarities[getRandomInt(fossilRarities.length)];
    const fossil = getRandomFossilByRarity(rarity);
    if (!fossil) continue;
    grid[y][x] = {
      ...grid[y][x],
      content: { type: "fossil", fossilId: fossil.id, rarity: fossil.rarity },
    };
    placed.add(key);
    count++;
  }
  // Place energy cells after fossils
  const energyCellCount = Math.floor(size * size * 0.15);
  const mineralCellCount = Math.floor(size * size * 0.15);
  const withEnergy = placeEnergyCellsOnGrid(grid, energyCellCount, 50);
  return placeMineralCellsOnGrid(withEnergy, mineralCellCount, 25);
}

export const digSites: DigSite[] = [
  {
    id: "badlands",
    name: "Badlands Basin",
    description: "Common fossils, shallow excavation, low energy requirements.",
    difficulty: "beginner",
    gridSize: 8,
    maxLayers: 2,
    energyCost: 5,
    fossilRarity: ["common"],
    unlocked: true,
    imageUrl: "https://via.placeholder.com/80?text=Badlands",
    unlockFossilCount: 0,
    backgroundColor: "#f5e9da"
  },
  {
    id: "mountain",
    name: "Mountain Ridge",
    description: "Rare fossils, medium depth, moderate energy requirements.",
    difficulty: "intermediate",
    gridSize: 10,
    maxLayers: 3,
    energyCost: 10,
    fossilRarity: ["common", "rare"],
    unlocked: false,
    imageUrl: "https://via.placeholder.com/80?text=Mountain",
    unlockFossilCount: 3,
    backgroundColor: "#e0e4ec"
  },
  {
    id: "canyon",
    name: "Deep Canyon",
    description: "Legendary fossils, deep excavation, high energy requirements.",
    difficulty: "advanced",
    gridSize: 12,
    maxLayers: 4,
    energyCost: 15,
    fossilRarity: ["rare", "legendary"],
    unlocked: false,
    imageUrl: "https://via.placeholder.com/80?text=Canyon",
    unlockFossilCount: 6,
    backgroundColor: "#d0e6e6"
  }
];

export function getDinosaurCollectionStatus(inventory: Fossil[]) {
  return dinosaurData.map(dino => {
    const requiredPieces = dino.requiredPieces as FossilPieceType[];
    const piecesCollected = requiredPieces.filter((piece) =>
      inventory.some((f) => f.dinosaurSpecies === dino.name && f.pieceType === piece)
    );
    const piecesMissing = requiredPieces.filter((piece) =>
      !piecesCollected.includes(piece)
    );
    return {
      name: dino.name,
      requiredPieces,
      piecesCollected,
      piecesMissing,
      completed: piecesMissing.length === 0,
      facts: dino.facts
    };
  });
}

export const achievements = [
  {
    id: "first-fossil",
    name: "First Fossil Found",
    description: "Discover your first fossil.",
    icon: "🦴"
  },
  {
    id: "dino-complete",
    name: "Dinosaur Completed",
    description: "Complete a full dinosaur skeleton.",
    icon: "🦕"
  },
  {
    id: "all-sites",
    name: "Explorer",
    description: "Unlock all dig sites.",
    icon: "🌎"
  },
  {
    id: "tool-master",
    name: "Tool Master",
    description: "Use every tool at least once.",
    icon: "🛠️"
  },
  {
    id: "fossil-hunter",
    name: "Fossil Hunter",
    description: "Find 10 fossils.",
    icon: "🔎"
  },
  {
    id: "legendary-find",
    name: "Legendary Find",
    description: "Discover a legendary fossil.",
    icon: "🌟"
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Complete all dinosaurs.",
    icon: "🏆"
  }
];

export function checkAchievements(gameState: any) {
  const unlocked: string[] = [];
  // First fossil
  if (gameState.inventory.length > 0) unlocked.push("first-fossil");
  // Dinosaur completed
  const dinoStatus = getDinosaurCollectionStatus(gameState.inventory);
  if (dinoStatus.some(d => d.completed)) unlocked.push("dino-complete");
  // All sites unlocked
  if (gameState.availableSites && gameState.availableSites.every((s: any) => s.unlocked)) unlocked.push("all-sites");
  // Tool Master: use every tool at least once
  if (gameState.toolStates && gameState.toolStates.every((t: any) => t.durability < t.maxDurability)) unlocked.push("tool-master");
  // Fossil Hunter: find 10 fossils
  if (gameState.inventory.length >= 10) unlocked.push("fossil-hunter");
  // Legendary Find: discover a legendary fossil
  if (gameState.inventory.some((f: any) => f.rarity === "legendary")) unlocked.push("legendary-find");
  // Perfectionist: complete all dinosaurs
  if (dinoStatus.every(d => d.completed)) unlocked.push("perfectionist");
  return unlocked;
}


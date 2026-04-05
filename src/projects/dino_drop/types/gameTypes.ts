export type Rarity = 'common' | 'rare' | 'legendary';

export type ToolType = 'brush' | 'chisel' | 'hammer' | 'sieve' | 'scanner';

export type FossilPieceType = 'skull' | 'vertebrae' | 'limb' | 'rib' | 'tail';

export type DinosaurCategory = 'herbivore' | 'carnivore' | 'aquatic' | 'flying' | 'marine';

export interface Position {
  x: number;
  y: number;
}

export interface Tool {
  id: ToolType;
  name: string;
  description: string;
  energyCost: number;
  precision: number;
  durability: number;
  maxDurability: number;
  icon: string;
}

export interface Fossil {
  id: string;
  name: string;
  dinosaurSpecies: string;
  category: DinosaurCategory;
  rarity: Rarity;
  pieceType: FossilPieceType;
  completeness: number; // 0-100%
  discoveryDate: Date;
  siteFound: string;
  description: string;
  imageUrl?: string;
}

export interface Dinosaur {
  id: string;
  name: string;
  scientificName: string;
  category: DinosaurCategory;
  period: string;
  description: string;
  facts: string[];
  requiredPieces: FossilPieceType[];
  imageUrl?: string;
}

export interface DigSite {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  gridSize: number;
  maxLayers: number;
  energyCost: number;
  fossilRarity: Rarity[];
  unlocked: boolean;
  imageUrl?: string;
  unlockFossilCount?: number;
  backgroundColor?: string;
}

export interface GridCell {
  x: number;
  y: number;
  layer: number;
  maxLayers: number;
  content: CellContent;
  isRevealed: boolean;
  isFlagged: boolean;
  excavationProgress: number; // 0-100%
}

export type CellContent = 
  | { type: 'empty' }
  | { type: 'fossil'; fossilId: string; rarity: Rarity }
  | { type: 'artifact'; artifactId: string; name: string; rarity: Rarity }
  | { type: 'obstacle'; obstacleType: string; name: string }
  | { type: 'energy'; amount: number }
  | { type: 'mineral'; amount: number };

export interface GameState {
  currentSite: DigSite;
  excavationGrid: GridCell[][];
  selectedTool: Tool;
  energy: number;
  maxEnergy: number;
  inventory: Fossil[];
  discoveredFossils: string[];
  score: number;
  level: number;
  experience: number;
  isPaused: boolean;
  gameOver: boolean;
  achievements: Achievement[];
  money: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedDate?: Date;
  icon: string;
}

export interface GameMetrics {
  gamesPlayed: number;
  totalScore: number;
  averageScore: number;
  fossilsDiscovered: number;
  dinosaursCompleted: number;
  timeElapsed: number;
  achievementsUnlocked: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
  autoSave: boolean;
} 
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 480;
export const GRID_SIZE = 48;
export const ROWS = GAME_HEIGHT / GRID_SIZE;
export const COLS = GAME_WIDTH / GRID_SIZE;

export const MOVE_DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
} as const;

export type Direction = typeof MOVE_DIRECTIONS[keyof typeof MOVE_DIRECTIONS];

export type Position = {
  x: number;
  y: number;
};

export type ObstacleType = 'car1' | 'car2' | 'car3' | 'log' | 'turtle';

export interface Obstacle {
  id: string;
  type: ObstacleType;
  position: Position;
  width: number; // Width in grid cells
  speed: number; // Pixels per frame
  direction: 1 | -1; // 1 for right, -1 for left
}

export interface Level {
  id: number;
  name: string;
  roadRows: number[];
  riverRows: number[];
  homeRows: number[];
  obstacles: Obstacle[];
  speedMultiplier: number;
}

// Create levels with increasing difficulty but slowed down for better playability
export const levels: Level[] = [
  {
    id: 1,
    name: "Level 1",
    roadRows: [6, 7, 8],
    riverRows: [2, 3, 4],
    homeRows: [1],
    speedMultiplier: 0.7, // Reduced from 1.0
    obstacles: [
      // Road obstacles (cars)
      { id: 'car1-1', type: 'car1', position: { x: 0, y: 6 }, width: 1, speed: 1, direction: 1 },
      { id: 'car1-2', type: 'car1', position: { x: 5, y: 6 }, width: 1, speed: 1, direction: 1 },
      { id: 'car2-1', type: 'car2', position: { x: 8, y: 7 }, width: 1, speed: 1.5, direction: -1 },
      { id: 'car2-2', type: 'car2', position: { x: 3, y: 7 }, width: 1, speed: 1.5, direction: -1 },
      { id: 'car3-1', type: 'car3', position: { x: 2, y: 8 }, width: 2, speed: 0.7, direction: 1 },
      
      // River obstacles (logs and turtles)
      { id: 'log1-1', type: 'log', position: { x: 0, y: 2 }, width: 3, speed: 0.8, direction: 1 },
      { id: 'log1-2', type: 'log', position: { x: 6, y: 2 }, width: 3, speed: 0.8, direction: 1 },
      { id: 'turtle1-1', type: 'turtle', position: { x: 1, y: 3 }, width: 2, speed: 1.2, direction: -1 },
      { id: 'turtle1-2', type: 'turtle', position: { x: 6, y: 3 }, width: 2, speed: 1.2, direction: -1 },
      { id: 'log2-1', type: 'log', position: { x: 2, y: 4 }, width: 2, speed: 1, direction: 1 },
      { id: 'log2-2', type: 'log', position: { x: 7, y: 4 }, width: 2, speed: 1, direction: 1 },
    ]
  },
  {
    id: 2,
    name: "Level 2",
    roadRows: [6, 7, 8],
    riverRows: [2, 3, 4],
    homeRows: [1],
    speedMultiplier: 0.9, // Reduced from 1.3
    obstacles: [
      // Road obstacles (cars) - more and faster
      { id: 'car1-1', type: 'car1', position: { x: 0, y: 6 }, width: 1, speed: 1.2, direction: 1 },
      { id: 'car1-2', type: 'car1', position: { x: 4, y: 6 }, width: 1, speed: 1.2, direction: 1 },
      { id: 'car1-3', type: 'car1', position: { x: 8, y: 6 }, width: 1, speed: 1.2, direction: 1 },
      { id: 'car2-1', type: 'car2', position: { x: 7, y: 7 }, width: 1, speed: 1.7, direction: -1 },
      { id: 'car2-2', type: 'car2', position: { x: 3, y: 7 }, width: 1, speed: 1.7, direction: -1 },
      { id: 'car3-1', type: 'car3', position: { x: 1, y: 8 }, width: 2, speed: 0.9, direction: 1 },
      { id: 'car3-2', type: 'car3', position: { x: 6, y: 8 }, width: 2, speed: 0.9, direction: 1 },
      
      // River obstacles - narrower gaps
      { id: 'log1-1', type: 'log', position: { x: 0, y: 2 }, width: 2, speed: 1, direction: 1 },
      { id: 'log1-2', type: 'log', position: { x: 5, y: 2 }, width: 2, speed: 1, direction: 1 },
      { id: 'turtle1-1', type: 'turtle', position: { x: 1, y: 3 }, width: 1, speed: 1.4, direction: -1 },
      { id: 'turtle1-2', type: 'turtle', position: { x: 5, y: 3 }, width: 1, speed: 1.4, direction: -1 },
      { id: 'turtle1-3', type: 'turtle', position: { x: 8, y: 3 }, width: 1, speed: 1.4, direction: -1 },
      { id: 'log2-1', type: 'log', position: { x: 3, y: 4 }, width: 2, speed: 1.2, direction: 1 },
      { id: 'log2-2', type: 'log', position: { x: 8, y: 4 }, width: 2, speed: 1.2, direction: 1 },
    ]
  },
  {
    id: 3,
    name: "Level 3",
    roadRows: [5, 6, 7, 8],
    riverRows: [2, 3, 4],
    homeRows: [1],
    speedMultiplier: 1.1, // Reduced from 1.6
    obstacles: [
      // Road obstacles - much more challenging
      { id: 'car1-1', type: 'car1', position: { x: 0, y: 5 }, width: 1, speed: 1.8, direction: 1 },
      { id: 'car1-2', type: 'car1', position: { x: 3, y: 5 }, width: 1, speed: 1.8, direction: 1 },
      { id: 'car1-3', type: 'car1', position: { x: 6, y: 5 }, width: 1, speed: 1.8, direction: 1 },
      { id: 'car2-1', type: 'car2', position: { x: 1, y: 6 }, width: 1, speed: 1.5, direction: -1 },
      { id: 'car2-2', type: 'car2', position: { x: 5, y: 6 }, width: 1, speed: 1.5, direction: -1 },
      { id: 'car2-3', type: 'car2', position: { x: 9, y: 6 }, width: 1, speed: 1.5, direction: -1 },
      { id: 'car3-1', type: 'car3', position: { x: 0, y: 7 }, width: 2, speed: 1.2, direction: 1 },
      { id: 'car3-2', type: 'car3', position: { x: 5, y: 7 }, width: 2, speed: 1.2, direction: 1 },
      { id: 'car1-4', type: 'car1', position: { x: 2, y: 8 }, width: 1, speed: 2, direction: -1 },
      { id: 'car1-5', type: 'car1', position: { x: 7, y: 8 }, width: 1, speed: 2, direction: -1 },
      
      // River obstacles - faster and more random
      { id: 'log1-1', type: 'log', position: { x: 0, y: 2 }, width: 2, speed: 1.5, direction: 1 },
      { id: 'log1-2', type: 'log', position: { x: 6, y: 2 }, width: 2, speed: 1.5, direction: 1 },
      { id: 'turtle1-1', type: 'turtle', position: { x: 2, y: 3 }, width: 1, speed: 1.8, direction: -1 },
      { id: 'turtle1-2', type: 'turtle', position: { x: 4, y: 3 }, width: 1, speed: 1.8, direction: -1 },
      { id: 'turtle1-3', type: 'turtle', position: { x: 7, y: 3 }, width: 1, speed: 1.8, direction: -1 },
      { id: 'log2-1', type: 'log', position: { x: 1, y: 4 }, width: 1, speed: 1.6, direction: 1 },
      { id: 'log2-2', type: 'log', position: { x: 4, y: 4 }, width: 1, speed: 1.6, direction: 1 },
      { id: 'log2-3', type: 'log', position: { x: 7, y: 4 }, width: 1, speed: 1.6, direction: 1 },
    ]
  },
];
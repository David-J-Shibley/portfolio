import type { TileKind } from "./tiles";

export type { TileKind };

export type GridPos = {
  z: number;
  x: number;
  y: number;
};

export type BoardTile = {
  id: string;
  kind: TileKind;
  z: number;
  x: number;
  y: number;
};

export type PieceType = 'red' | 'black';
export type PieceState = PieceType | 'redKing' | 'blackKing' | null;

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  captured?: Position;
}

export interface GameTile {
  position: Position;
  piece: PieceState;
  isPlayable: boolean;
  isHighlighted: boolean;
  isPossibleMove: boolean;
}

export interface GameState {
  board: GameTile[][];
  currentTurn: PieceType;
  selectedTile: Position | null;
  possibleMoves: Move[];
  capturedPieces: {
    red: number;
    black: number;
  };
  gameOver: boolean;
  winner: PieceType | null;
  isJumpAvailable: boolean;
}

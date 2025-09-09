
export interface Piece {
  shape: number[][];
  color: string;
  colorIndex: number;
}

export type Grid = number[][];

export interface Position {
  x: number;
  y: number;
}

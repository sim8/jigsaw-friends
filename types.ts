export type Piece = {
  colIndex: number;
  rowIndex: number;
};

export type PieceKey = string;

export type PieceState = {
  top: number;
  left: number;
  rotation: number;
};

export type JigsawState = Record<PieceKey, PieceState>;

export type JigsawConfig = {
  canvasWidth: number;
  canvasHeight: number;
  jigsawWidth: number;
  jigsawHeight: number;
  rows: number;
  columns: number;
};

export type DragPiece = {
  draggingPieceKey: PieceKey;
  pieceMouseOffsetX: number;
  pieceMouseOffsetY: number;
};

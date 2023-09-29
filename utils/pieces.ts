import { Piece } from '../types';

export function getPieceKey(piece: Piece) {
  return `[${piece.colIndex},${piece.rowIndex}]`;
}

export function getPieceFromKey(pieceKey: string): Piece {
  // @ts-expect-error todo
  const [colIndex, rowIndex] = pieceKey.match(/\d+/g);
  return {
    colIndex: parseInt(colIndex),
    rowIndex: parseInt(rowIndex),
  };
}

export function getPieceWidth(jigsawWidth: number, columns: number) {
  return jigsawWidth / columns;
}

export function getPieceHeight(jigsawHeight: number, rows: number) {
  return jigsawHeight / rows;
}

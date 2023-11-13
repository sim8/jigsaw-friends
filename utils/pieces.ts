import { JIGSAW_CONFIG } from '../constants/jigsawConfig';
import { Piece, PieceKey, PieceState, Vector } from '../types';

export function getPieceKey(piece: Piece) {
  return `${piece.colIndex},${piece.rowIndex}`;
}

export function getPieceFromKey(pieceKey: string): Piece {
  const [colIndex, rowIndex] = pieceKey.split(',');
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

function arePieceCoordinatesValid(piece: Piece) {
  const columnValid =
    piece.colIndex >= 0 && piece.colIndex <= JIGSAW_CONFIG.columns - 1;
  const rowValid =
    piece.rowIndex >= 0 && piece.rowIndex <= JIGSAW_CONFIG.rows - 1;
  return columnValid && rowValid;
}

export function getPossibleNeighbouringPieceKeys(pieceKey: PieceKey) {
  const piece = getPieceFromKey(pieceKey);

  const potentialPieces: Piece[] = [
    {
      colIndex: piece.colIndex,
      rowIndex: piece.rowIndex - 1,
    },
    {
      colIndex: piece.colIndex + 1,
      rowIndex: piece.rowIndex,
    },
    {
      colIndex: piece.colIndex,
      rowIndex: piece.rowIndex + 1,
    },
    {
      colIndex: piece.colIndex - 1,
      rowIndex: piece.rowIndex,
    },
  ];

  return potentialPieces.filter(arePieceCoordinatesValid).map(getPieceKey);
}

export function getPieceVectorRequiredForJoining(
  pieceAKey: PieceKey,
  pieceBKey: PieceKey,
): Vector {
  const pieceA = getPieceFromKey(pieceAKey);
  const pieceB = getPieceFromKey(pieceBKey);
  return [
    (pieceB.colIndex - pieceA.colIndex) *
      getPieceWidth(JIGSAW_CONFIG.jigsawWidth, JIGSAW_CONFIG.columns),
    (pieceB.rowIndex - pieceA.rowIndex) *
      getPieceHeight(JIGSAW_CONFIG.jigsawHeight, JIGSAW_CONFIG.rows),
  ];
}

export function getActualPieceVector(
  pieceAState: PieceState,
  pieceBState: PieceState,
): Vector {
  return [
    pieceBState.left - pieceAState.left,
    pieceBState.top - pieceAState.top,
  ];
}

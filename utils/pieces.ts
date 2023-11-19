import { JIGSAW_CONFIG } from '../constants/jigsawConfig';
import { Piece, PieceKey, PieceState, Vector } from '../types';
import { calcHypotenuse } from './misc';

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

export function getSolutionPieceVector(
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

// Thank you https://stackoverflow.com/a/28112459/22839249
function rotateVector(vector: Vector, ang: number) {
  const radians = ang * (Math.PI / 180);
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return [
    Math.round(10000 * (vector[0] * cos - vector[1] * sin)) / 10000,
    Math.round(10000 * (vector[0] * sin + vector[1] * cos)) / 10000,
  ];
}

export function getRequiredStateToJoinNeighbour({
  heldPieceKey,
  neighbourKey,
  neighbourState,
}: {
  heldPieceKey: PieceKey;
  neighbourKey: PieceKey;
  neighbourState: PieceState;
}): PieceState {
  const unrotatedVector = getSolutionPieceVector(neighbourKey, heldPieceKey);
  const rotatedVector = rotateVector(unrotatedVector, neighbourState.rotation);
  return {
    ...neighbourState,
    left: neighbourState.left + rotatedVector[0],
    top: neighbourState.top + rotatedVector[1],
  };
}

export function getPieceDistance(pieceA: PieceState, pieceB: PieceState) {
  const vector: Vector = [pieceB.left - pieceA.left, pieceB.top - pieceA.top];
  return calcHypotenuse(...vector);
}

export function getPieceRotationDifference(
  pieceA: PieceState,
  pieceB: PieceState,
) {
  const diff = Math.abs(pieceB.rotation - pieceA.rotation);
  return Math.min(diff, 360 - diff);
}

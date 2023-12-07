import { JIGSAW_CONFIG } from '../constants/jigsawConfig';
import { JigsawState, Piece, PieceKey, PieceState, Vector } from '../types';
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

function arePieceCoordinatesValid({
  piece,
  rows,
  columns,
}: {
  piece: Piece;
  rows: number;
  columns: number;
}) {
  const columnValid = piece.colIndex >= 0 && piece.colIndex <= columns - 1;
  const rowValid = piece.rowIndex >= 0 && piece.rowIndex <= rows - 1;
  return columnValid && rowValid;
}

export function getSolutionNeighbourKeys({
  pieceKey,
  columns,
  rows,
}: {
  pieceKey: PieceKey;
  columns: number;
  rows: number;
}) {
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

  return potentialPieces
    .filter((potentialPiece) =>
      arePieceCoordinatesValid({ piece: potentialPiece, rows, columns }),
    )
    .map(getPieceKey);
}

export function getSolutionPieceVector({
  pieceAKey,
  pieceBKey,
  rows,
  columns,
}: {
  pieceAKey: PieceKey;
  pieceBKey: PieceKey;
  rows: number;
  columns: number;
}): Vector {
  const pieceA = getPieceFromKey(pieceAKey);
  const pieceB = getPieceFromKey(pieceBKey);
  return [
    (pieceB.colIndex - pieceA.colIndex) *
      getPieceWidth(JIGSAW_CONFIG.jigsawWidth, columns),
    (pieceB.rowIndex - pieceA.rowIndex) *
      getPieceHeight(JIGSAW_CONFIG.jigsawHeight, rows),
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
  rows,
  columns,
}: {
  heldPieceKey: PieceKey;
  neighbourKey: PieceKey;
  neighbourState: PieceState;
  rows: number;
  columns: number;
}): PieceState {
  const unrotatedVector = getSolutionPieceVector({
    pieceAKey: neighbourKey,
    pieceBKey: heldPieceKey,
    rows,
    columns,
  });
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

export function getParentPieceKey(jigsaw: JigsawState, childKey: PieceKey) {
  const parentEntry = Object.entries(jigsaw).find(
    ([, pieceState]) =>
      pieceState.childPieces && childKey in pieceState.childPieces,
  );
  if (!parentEntry) {
    throw new Error(`Couldn't find parent piece`);
  }
  return parentEntry[0];
}

import { PIECE_ROTATION_AMOUNT } from '../constants/uiConfig';
import { JigsawConfig, JigsawState, PieceState } from '../types';
import { getPieceHeight, getPieceKey, getPieceWidth } from '../utils/pieces';

function getRandomRotation() {
  const possibleIntervals = 360 / PIECE_ROTATION_AMOUNT;
  return Math.floor(Math.random() * possibleIntervals) * PIECE_ROTATION_AMOUNT;
}

export function generateJigsawState({
  canvasWidth,
  canvasHeight,
  jigsawWidth,
  jigsawHeight,
  rows,
  columns,
}: JigsawConfig): JigsawState {
  const jigsawState: JigsawState = {};
  [...Array(rows)].forEach((_, rowIndex) => {
    [...Array(columns)].forEach((_, colIndex) => {
      const pieceKey = getPieceKey({
        colIndex,
        rowIndex,
      });
      const pieceState: PieceState = {
        top:
          Math.random() * (canvasHeight - getPieceHeight(jigsawHeight, rows)),
        left: Math.random() * (canvasWidth - getPieceWidth(jigsawWidth, rows)),
        rotation: getRandomRotation(),
      };
      jigsawState[pieceKey] = pieceState;
    });
  });

  return jigsawState;
}

import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PIECE_ROTATION_AMOUNT,
} from '../constants/uiConfig';
import { JigsawState, PieceState } from '../types';
import { getPieceHeight, getPieceKey, getPieceWidth } from '../utils/pieces';

function getRandomRotation() {
  const possibleIntervals = 360 / PIECE_ROTATION_AMOUNT;
  return Math.floor(Math.random() * possibleIntervals) * PIECE_ROTATION_AMOUNT;
}

export function generateJigsawState({
  jigsawWidth,
  jigsawHeight,
  rows,
  columns,
}: {
  jigsawWidth: number;
  jigsawHeight: number;
  rows: number;
  columns: number;
}): JigsawState {
  const jigsawState: JigsawState = {};
  [...Array(rows)].forEach((_, rowIndex) => {
    [...Array(columns)].forEach((_, colIndex) => {
      const pieceKey = getPieceKey({
        colIndex,
        rowIndex,
      });
      const pieceState: PieceState = {
        top:
          Math.random() * (CANVAS_HEIGHT - getPieceHeight(jigsawHeight, rows)),
        left: Math.random() * (CANVAS_WIDTH - getPieceWidth(jigsawWidth, rows)),
        rotation: getRandomRotation(),
      };
      jigsawState[pieceKey] = pieceState;
    });
  });

  return jigsawState;
}

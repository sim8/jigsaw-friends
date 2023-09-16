import { JigsawConfig, JigsawState, PieceState } from '../types';
import { getPieceHeight, getPieceKey, getPieceWidth } from '../utils/pieces';

export function generateJigsawState({
  canvasWidth,
  canvasHeight,
  jigsawWidth,
  jigsawHeight,
  rows,
  columns,
}: JigsawConfig): JigsawState {
  const jigsawState = {};
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
        rotation: Math.random() * 360,
      };
      jigsawState[pieceKey] = pieceState;
    });
  });

  return jigsawState;
}

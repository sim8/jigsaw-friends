import { useMemo } from 'react';
import { DragPieceInfo, JigsawState, Vector } from '../types';
import {
  getActualPieceVector,
  getPieceHeight,
  getPieceVectorRequiredForJoining,
  getPieceWidth,
  getPossibleNeighbouringPieceKeys,
} from '../utils/pieces';
import { calcHypotenuse } from '../utils/misc';
import { JIGSAW_CONFIG } from '../constants/jigsawConfig';
import { PIECE_SNAP_THRESHOLD_PERCENTAGE } from '../constants/uiConfig';

export default function usePieceJoins({
  jigsaw,
  dragPieceInfo,
}: {
  jigsaw: JigsawState;
  dragPieceInfo: DragPieceInfo | null;
}) {
  const { draggingPieceKey } = dragPieceInfo || {};
  const possibleNeighbouringPieceKeys = useMemo(() => {
    if (!draggingPieceKey) {
      return null;
    }
    return getPossibleNeighbouringPieceKeys(draggingPieceKey);
  }, [draggingPieceKey]);

  const pieceSnapThresholdDistance = useMemo(() => {
    const pieceWidth = getPieceWidth(
      JIGSAW_CONFIG.jigsawWidth,
      JIGSAW_CONFIG.columns,
    );
    const pieceHeight = getPieceHeight(
      JIGSAW_CONFIG.jigsawHeight,
      JIGSAW_CONFIG.rows,
    );
    const pieceDiagonal = calcHypotenuse(pieceWidth, pieceHeight);
    return pieceDiagonal * PIECE_SNAP_THRESHOLD_PERCENTAGE;
  }, []);

  return {
    maybeJoinPieces: () => {
      if (!draggingPieceKey) {
        return;
      }
      const piece = jigsaw[draggingPieceKey];

      if (possibleNeighbouringPieceKeys) {
        possibleNeighbouringPieceKeys.forEach(
          (possibleNeighbouringPieceKey) => {
            const actualVector = getActualPieceVector(
              piece,
              jigsaw[possibleNeighbouringPieceKey],
            );
            const vectorRequiredForJoining = getPieceVectorRequiredForJoining(
              draggingPieceKey,
              possibleNeighbouringPieceKey,
            );
            const actualToRequiredDelta: Vector = [
              vectorRequiredForJoining[0] - actualVector[0],
              vectorRequiredForJoining[1] - actualVector[1],
            ];
            const actualToRequiredDeltaDistance = calcHypotenuse(
              actualToRequiredDelta[0],
              actualToRequiredDelta[1],
            );
            if (actualToRequiredDeltaDistance < pieceSnapThresholdDistance) {
              console.log('JOIN!!!!!');
            }
          },
        );
      }
    },
  };
}

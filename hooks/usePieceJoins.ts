import { useMemo } from 'react';
import { DragPieceInfo, JigsawState } from '../types';
import {
  getPieceDistance,
  getPieceHeight,
  getPieceRotationDifference,
  getPieceWidth,
  getPossibleNeighbouringPieceKeys,
  getRequiredStateToJoinNeighbour,
} from '../utils/pieces';
import { calcHypotenuse } from '../utils/misc';
import { JIGSAW_CONFIG } from '../constants/jigsawConfig';
import {
  PIECE_SNAP_ROTATION_THRESHOLD,
  PIECE_SNAP_DISTANCE_PERCENTAGE_THRESHOLD,
} from '../constants/uiConfig';

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
    return pieceDiagonal * PIECE_SNAP_DISTANCE_PERCENTAGE_THRESHOLD;
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
            const requiredStateToJoinNeighbour =
              getRequiredStateToJoinNeighbour({
                heldPieceKey: draggingPieceKey,
                neighbourKey: possibleNeighbouringPieceKey,
                neighbourState: jigsaw[possibleNeighbouringPieceKey],
              });
            const distance = getPieceDistance(
              piece,
              requiredStateToJoinNeighbour,
            );
            const rotationDifference = getPieceRotationDifference(
              piece,
              requiredStateToJoinNeighbour,
            );
            if (
              distance <= pieceSnapThresholdDistance &&
              rotationDifference <= PIECE_SNAP_ROTATION_THRESHOLD
            ) {
              console.log('JOIN!!!!!');
            }
          },
        );
      }
    },
  };
}

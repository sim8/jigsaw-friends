import { useMemo } from 'react';
import { DragPieceInfo, JigsawState, PieceKey } from '../types';
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
    getJoinablePiece: (): PieceKey | null => {
      if (!draggingPieceKey || !possibleNeighbouringPieceKeys) {
        return null;
      }
      const piece = jigsaw[draggingPieceKey];

      for (const possibleNeighbouringPieceKey of possibleNeighbouringPieceKeys) {
        const neighbourState = jigsaw[possibleNeighbouringPieceKey];
        if (neighbourState.heldBy) {
          // avoid weirdness by not allowing joining two held pieces
          return null;
        }
        const requiredStateToJoinNeighbour = getRequiredStateToJoinNeighbour({
          heldPieceKey: draggingPieceKey,
          neighbourKey: possibleNeighbouringPieceKey,
          neighbourState,
        });
        const distance = getPieceDistance(piece, requiredStateToJoinNeighbour);
        const rotationDifference = getPieceRotationDifference(
          piece,
          requiredStateToJoinNeighbour,
        );
        if (
          distance <= pieceSnapThresholdDistance &&
          rotationDifference <= PIECE_SNAP_ROTATION_THRESHOLD
        ) {
          return possibleNeighbouringPieceKey;
        }
      }

      return null;
    },
  };
}

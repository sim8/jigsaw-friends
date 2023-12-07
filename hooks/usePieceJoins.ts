import { useMemo } from 'react';
import { DragPieceInfo, JigsawState, PieceKey } from '../types';
import {
  getPieceDistance,
  getPieceHeight,
  getPieceRotationDifference,
  getPieceWidth,
  getSolutionNeighbourKeys,
  getRequiredStateToJoinNeighbour,
  getParentPieceKey,
} from '../utils/pieces';
import { calcHypotenuse } from '../utils/misc';
import { JIGSAW_CONFIG } from '../constants/jigsawConfig';
import {
  PIECE_SNAP_ROTATION_THRESHOLD,
  PIECE_SNAP_DISTANCE_PERCENTAGE_THRESHOLD,
} from '../constants/uiConfig';
import useGame from './useGame';

export default function usePieceJoins({
  jigsaw,
  dragPieceInfo,
}: {
  jigsaw: JigsawState;
  dragPieceInfo: DragPieceInfo | null;
}) {
  const { draggingPieceKey } = dragPieceInfo || {};
  const { rows, columns } = useGame();
  const solutionNeighbourKeys = useMemo(() => {
    if (!draggingPieceKey) {
      return null;
    }
    return getSolutionNeighbourKeys({
      pieceKey: draggingPieceKey,
      rows,
      columns,
    });
  }, [draggingPieceKey, columns, rows]);

  const pieceSnapThresholdDistance = useMemo(() => {
    const pieceWidth = getPieceWidth(JIGSAW_CONFIG.jigsawWidth, columns);
    const pieceHeight = getPieceHeight(JIGSAW_CONFIG.jigsawHeight, rows);
    const pieceDiagonal = calcHypotenuse(pieceWidth, pieceHeight);
    return pieceDiagonal * PIECE_SNAP_DISTANCE_PERCENTAGE_THRESHOLD;
  }, [columns, rows]);

  return {
    getJoinablePiece: (): PieceKey | null => {
      if (!draggingPieceKey || !solutionNeighbourKeys) {
        return null;
      }
      const piece = jigsaw[draggingPieceKey];

      for (const solutionNeighbourKey of solutionNeighbourKeys) {
        const neighbourKey =
          solutionNeighbourKey in jigsaw
            ? solutionNeighbourKey
            : getParentPieceKey(jigsaw, solutionNeighbourKey);
        const neighbourState = jigsaw[neighbourKey];

        if (neighbourState.heldBy) {
          // avoid weirdness by not allowing joining two held pieces
          return null;
        }
        const requiredStateToJoinNeighbour = getRequiredStateToJoinNeighbour({
          heldPieceKey: draggingPieceKey,
          neighbourKey,
          neighbourState,
          rows,
          columns,
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
          return neighbourKey;
        }
      }

      return null;
    },
  };
}

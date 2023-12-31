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
  const { rows, columns, jigsawWidth, jigsawHeight } = useGame();
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
    const pieceWidth = getPieceWidth(jigsawWidth, columns);
    const pieceHeight = getPieceHeight(jigsawHeight, rows);
    const pieceDiagonal = calcHypotenuse(pieceWidth, pieceHeight);
    return pieceDiagonal * PIECE_SNAP_DISTANCE_PERCENTAGE_THRESHOLD;
  }, [columns, rows, jigsawWidth, jigsawHeight]);

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
          jigsawWidth,
          jigsawHeight,
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

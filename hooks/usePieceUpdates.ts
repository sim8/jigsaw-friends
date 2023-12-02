import {
  MouseEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import useGame from '../hooks/useGame';
import useUser from '../hooks/useUser';
import { DragPieceInfo, PieceKey, PieceState } from '../types';
import {
  joinPiece,
  pickUpPiece,
  releasePiece,
  rotatePiece,
  setPiecePos,
} from '../lib/actions';
import { PIECE_ROTATION_INTERVAL } from '../constants/uiConfig';
import { getMousePosWithinElement } from '../utils/dom';
import usePieceJoins from './usePieceJoins';

export default function usePieceUpdates({
  canvasRef,
}: {
  canvasRef: RefObject<HTMLDivElement>;
}) {
  const { gameKey, jigsaw } = useGame();
  const { user } = useUser();

  if (!user || !jigsaw) {
    // TODO maybe enforce this through context?
    throw new Error('TODO this should never happen');
  }

  const [dragPieceInfo, setDragPieceInfo] = useState<DragPieceInfo | null>(
    null,
  );

  const { getJoinablePiece } = usePieceJoins({
    dragPieceInfo,
    jigsaw,
  });

  const [rotatingDirection, setRotatingDirection] = useState<
    'clockwise' | 'anticlockwise' | null
  >(null);

  const updatePieceRotationInterval = useRef<NodeJS.Timer | null>(null);

  const clearRotationInterval = () => {
    if (typeof updatePieceRotationInterval.current === 'number') {
      clearInterval(updatePieceRotationInterval.current);
    }
  };

  const onCancelDrag = async (didDrop?: boolean) => {
    let didJoin = false;
    if (!dragPieceInfo) {
      return;
    }
    if (didDrop) {
      const joinablePiece = getJoinablePiece();
      if (joinablePiece) {
        const transactionResult = await joinPiece({
          gameKey,
          heldPieceKey: dragPieceInfo.draggingPieceKey,
          joiningPieceKey: joinablePiece,
        });
        didJoin = transactionResult.committed;
      }
    }
    if (!didJoin) {
      releasePiece({
        gameKey,
        pieceKey: dragPieceInfo.draggingPieceKey,
        uid: user.uid,
      });
    }
    setDragPieceInfo(null);
    setRotatingDirection(null);
    clearRotationInterval();
  };

  const { draggingPieceKey } = dragPieceInfo || {};

  useEffect(() => {
    if (rotatingDirection && draggingPieceKey) {
      const doRotation = () =>
        rotatePiece({
          gameKey,
          pieceKey: draggingPieceKey,
          direction: rotatingDirection,
        });

      doRotation();
      updatePieceRotationInterval.current = setInterval(() => {
        doRotation();
      }, PIECE_ROTATION_INTERVAL);

      return clearRotationInterval;
    }
  }, [rotatingDirection, draggingPieceKey, gameKey]);

  const onDrag = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!dragPieceInfo || !canvasRef.current) {
        return;
      }
      const { top, left } = getMousePosWithinElement(e, canvasRef.current);
      const pieceTop = top - dragPieceInfo.initialPieceMouseOffsetY;
      const pieceLeft = left - dragPieceInfo.initialPieceMouseOffsetX;

      // // TODO do we want to store "uncomitted" piece state locally?
      // setPieceState(draggingPieceKey, {
      //   top: pieceTop,
      //   left: pieceLeft,
      // });

      setPiecePos({
        gameKey,
        pieceKey: dragPieceInfo.draggingPieceKey,
        left: pieceLeft,
        top: pieceTop,
      });
    },
    [canvasRef, dragPieceInfo, gameKey],
  );

  const onMouseDown = useCallback(
    (
      e: MouseEvent<HTMLDivElement>,
      pieceKey: PieceKey,
      pieceState: PieceState,
    ) => {
      if (canvasRef.current) {
        pickUpPiece({
          gameKey,
          pieceKey,
          uid: user.uid,
        }).then((transactionResult) => {
          if (transactionResult.committed && canvasRef.current) {
            // only here do we want to send piece updates
            const { top, left } = getMousePosWithinElement(
              e,
              canvasRef.current,
            );
            const initialPieceMouseOffsetX = left - pieceState.left;
            const initialPieceMouseOffsetY = top - pieceState.top;

            setDragPieceInfo({
              draggingPieceKey: pieceKey,
              initialPieceMouseOffsetX,
              initialPieceMouseOffsetY,
            });
          }
        });
      }
    },
    [canvasRef, gameKey, user.uid],
  );

  return {
    onMouseDown,
    onDrag,
    onCancelDrag,
    dragPieceInfo,
    setRotatingDirection,
  };
}

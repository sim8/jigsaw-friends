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
  cancellablePieceUpdate,
  pickUpPiece,
  releasePiece,
  rotatePiece,
} from '../lib/actions';
import { PIECE_ROTATION_INTERVAL } from '../constants/uiConfig';
import { getMousePosWithinElement } from '../utils/dom';

export default function usePieceUpdates({
  canvasRef,
}: {
  canvasRef: RefObject<HTMLDivElement>;
}) {
  const { gameKey } = useGame();
  const { user } = useUser();

  if (!user) {
    // TODO maybe enforce this through context?
    throw new Error('TODO this should never happen');
  }

  const dragPieceInfoRef = useRef<DragPieceInfo | null>(null);

  const [rotatingDirection, setRotatingDirection] = useState<
    'clockwise' | 'anticlockwise' | null
  >(null);

  const updatePieceRotationInterval = useRef<NodeJS.Timer | null>(null);

  const clearRotationInterval = () => {
    if (typeof updatePieceRotationInterval.current === 'number') {
      clearInterval(updatePieceRotationInterval.current);
    }
  };

  const onCancelDrag = () => {
    if (!dragPieceInfoRef.current) {
      return;
    }
    releasePiece({
      gameKey,
      pieceKey: dragPieceInfoRef.current.draggingPieceKey,
      uid: user.uid,
    });
    dragPieceInfoRef.current = null;
    setRotatingDirection(null);
    clearRotationInterval();
  };

  useEffect(() => {
    if (rotatingDirection && dragPieceInfoRef.current) {
      const doRotation = () => {
        if (dragPieceInfoRef.current) {
          rotatePiece({
            gameKey,
            pieceKey: dragPieceInfoRef.current.draggingPieceKey,
            direction: rotatingDirection,
          });
        }
      };

      doRotation();
      updatePieceRotationInterval.current = setInterval(() => {
        doRotation();
      }, PIECE_ROTATION_INTERVAL);

      return clearRotationInterval;
    }
  }, [rotatingDirection, dragPieceInfoRef, gameKey]);

  const onDrag = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (!dragPieceInfoRef.current || !canvasRef.current) {
        return;
      }
      const { top, left } = getMousePosWithinElement(e, canvasRef.current);
      const pieceTop = top - dragPieceInfoRef.current.initialPieceMouseOffsetY;
      const pieceLeft =
        left - dragPieceInfoRef.current.initialPieceMouseOffsetX;

      // // TODO do we want to store "uncomitted" piece state locally?
      // setPieceState(draggingPieceKey, {
      //   top: pieceTop,
      //   left: pieceLeft,
      // });

      // console.log('I'.repeat(Math.floor(pieceLeft / 10)));

      if (dragPieceInfoRef.current.committed) {
        console.log('%c COMMITTED ', 'color: #00cc29');
      } else {
        console.log('%c DRAFT ', 'color: #d90000');
      }

      console.log(
        'setting:  ',
        'I'.repeat(Math.floor(pieceLeft / 5)),
        ` (${Math.floor(pieceLeft)})`,
      );

      cancellablePieceUpdate({
        gameKey,
        pieceKey: dragPieceInfoRef.current.draggingPieceKey,
        uid: user.uid,
        committed: dragPieceInfoRef.current.committed,
        updates: {
          left: pieceLeft,
          top: pieceTop,
        },
      });

      // setPiecePos({
      //   gameKey,
      //   pieceKey: dragPieceInfo.draggingPieceKey,
      //   left: pieceLeft,
      //   top: pieceTop,
      // });
    },
    [canvasRef, dragPieceInfoRef, gameKey, user.uid],
  );

  const onMouseDown = useCallback(
    (
      e: MouseEvent<HTMLElement>,
      pieceKey: PieceKey,
      pieceState: PieceState,
    ) => {
      if (canvasRef.current) {
        const { top, left } = getMousePosWithinElement(e, canvasRef.current);
        const initialPieceMouseOffsetX = left - pieceState.left;
        const initialPieceMouseOffsetY = top - pieceState.top;

        dragPieceInfoRef.current = {
          draggingPieceKey: pieceKey,
          initialPieceMouseOffsetX,
          initialPieceMouseOffsetY,
          committed: false,
        };
        pickUpPiece({
          gameKey,
          pieceKey,
          uid: user.uid,
        }).then((transactionResult) => {
          if (dragPieceInfoRef.current && transactionResult.committed) {
            dragPieceInfoRef.current.committed = true;
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
    dragPieceInfoRef,
    setRotatingDirection,
  };
}

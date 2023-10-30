import styled from 'styled-components';
import { DragPieceInfo } from '../types';
import Piece from './Piece';
import { useEffect, useRef, useState } from 'react';
import { getMousePosWithinElement } from '../utils/dom';
import { keyboardShortcuts } from '../constants/keyboardShortcuts';
import { PIECE_ROTATION_INTERVAL } from '../constants/uiConfig';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  JIGSAW_CONFIG,
} from '../constants/jigsawConfig';
import useGame from '../hooks/useGame';
import {
  pickUpPiece,
  releasePiece,
  rotatePiece,
  setPiecePos,
} from '../lib/actions';
import useUser from '../hooks/useUser';

const CanvasWrapper = styled.div`
  outline: 7px solid #0099ff;
  height: ${CANVAS_HEIGHT}px;
  width: ${CANVAS_WIDTH}px;
  position: relative;
`;

export default function JigsawCanvas() {
  const { jigsaw: jigsawState, gameKey } = useGame();
  const { user } = useUser();
  if (!jigsawState) {
    // TODO maybe enforce this through context?
    throw new Error('jigsawState not defined but it should be!!!');
  }

  if (!user) {
    throw new Error('TODO this should never happen');
  }

  const canvasRef = useRef<HTMLDivElement>(null);

  const [dragPieceInfo, setDragPieceInfo] = useState<DragPieceInfo | null>(
    null,
  );
  const [rotatingDirection, setRotatingDirection] = useState<
    'clockwise' | 'anticlockwise' | null
  >(null);

  const { draggingPieceKey } = dragPieceInfo || {};

  const updatePieceRotationInterval = useRef<NodeJS.Timer | null>(null);

  const clearRotationInterval = () => {
    if (typeof updatePieceRotationInterval.current === 'number') {
      clearInterval(updatePieceRotationInterval.current);
    }
  };

  const maybeCancelDrag = () => {
    if (!dragPieceInfo) {
      return;
    }
    releasePiece({
      gameKey,
      pieceKey: dragPieceInfo.draggingPieceKey,
      uid: user.uid,
    });
    setDragPieceInfo(null);
    setRotatingDirection(null);
    clearRotationInterval();
  };

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

  return (
    <CanvasWrapper
      ref={canvasRef}
      tabIndex={0}
      onKeyDown={(e) => {
        if (!draggingPieceKey) {
          return;
        }
        const key = e.key.toLowerCase();

        if (key === keyboardShortcuts.ROTATE_CLOCKWISE) {
          setRotatingDirection('clockwise');
        } else if (key === keyboardShortcuts.ROTATE_ANTICLOCKWISE) {
          setRotatingDirection('anticlockwise');
        }
      }}
      onKeyUp={() => {
        setRotatingDirection(null);
      }}
      onMouseUp={() => maybeCancelDrag()}
      onMouseLeave={() => maybeCancelDrag()}
      onMouseMove={(e) => {
        if (dragPieceInfo && canvasRef.current && draggingPieceKey) {
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
            pieceKey: draggingPieceKey,
            left: pieceLeft,
            top: pieceTop,
          });
        }
      }}
    >
      {Object.entries(jigsawState).map(([pieceKey, pieceState]) => {
        return (
          <Piece
            key={pieceKey}
            pieceKey={pieceKey}
            pieceState={pieceState}
            jigsawConfig={JIGSAW_CONFIG}
            onMouseDown={(e) => {
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
            }}
            isDragging={draggingPieceKey === pieceKey}
          />
        );
      })}
    </CanvasWrapper>
  );
}

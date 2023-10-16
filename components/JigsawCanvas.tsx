import styled from 'styled-components';
import { DragPiece } from '../types';
import Piece from './Piece';
import { useEffect, useRef, useState } from 'react';
import { getMousePosWithinElement } from '../utils/dom';
import { keyboardShortcuts } from '../constants/keyboardShortcuts';
import {
  PIECE_ROTATION_AMOUNT,
  PIECE_ROTATION_INTERVAL,
} from '../constants/uiConfig';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  JIGSAW_CONFIG,
} from '../constants/jigsawConfig';
import useGame from '../hooks/useGame';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updatePieceRotation = (...args: unknown[]) => {};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const setPieceState = (...args: unknown[]) => {};

const CanvasWrapper = styled.div`
  outline: 7px solid #0099ff;
  height: ${CANVAS_HEIGHT}px;
  width: ${CANVAS_WIDTH}px;
  position: relative;
`;

export default function JigsawCanvas() {
  const { jigsaw: jigsawState } = useGame();
  if (!jigsawState) {
    // TODO maybe enforce this through context?
    throw new Error('jigsawState not defined but it should be!!!');
  }

  const canvasRef = useRef<HTMLDivElement>(null);

  const [dragPiece, setDragPiece] = useState<DragPiece | null>(null);
  const [rotating, setRotating] = useState<
    'clockwise' | 'anticlockwise' | null
  >(null);

  const { draggingPieceKey } = dragPiece || {};

  const updatePieceRotationInterval = useRef<NodeJS.Timer | null>(null);

  const clearRotationInterval = () => {
    if (typeof updatePieceRotationInterval.current === 'number') {
      clearInterval(updatePieceRotationInterval.current);
    }
  };

  const cancelDrag = () => {
    setDragPiece(null);
    setRotating(null);
    clearRotationInterval();
  };

  useEffect(() => {
    if (rotating && draggingPieceKey) {
      updatePieceRotationInterval.current = setInterval(() => {
        updatePieceRotation(draggingPieceKey, (prev: number) =>
          rotating === 'clockwise'
            ? prev + PIECE_ROTATION_AMOUNT
            : prev - PIECE_ROTATION_AMOUNT,
        );
      }, PIECE_ROTATION_INTERVAL);

      return clearRotationInterval;
    }
  }, [rotating, draggingPieceKey]);

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
          setRotating('clockwise');
        } else if (key === keyboardShortcuts.ROTATE_ANTICLOCKWISE) {
          setRotating('anticlockwise');
        }
      }}
      onKeyUp={() => {
        setRotating(null);
      }}
      onMouseUp={() => cancelDrag()}
      onMouseLeave={() => cancelDrag()}
      onMouseMove={(e) => {
        if (dragPiece && canvasRef.current && draggingPieceKey) {
          const { top, left } = getMousePosWithinElement(e, canvasRef.current);
          const pieceTop = top - dragPiece.pieceMouseOffsetY;
          const pieceLeft = left - dragPiece.pieceMouseOffsetX;
          setPieceState(draggingPieceKey, {
            top: pieceTop,
            left: pieceLeft,
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
                const { top, left } = getMousePosWithinElement(
                  e,
                  canvasRef.current,
                );
                const pieceMouseOffsetX = left - pieceState.left;
                const pieceMouseOffsetY = top - pieceState.top;

                setDragPiece({
                  draggingPieceKey: pieceKey,
                  pieceMouseOffsetX,
                  pieceMouseOffsetY,
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

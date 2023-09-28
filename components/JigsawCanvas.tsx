import styled from 'styled-components';
import useJigsawState from '../hooks/useJigsawState';
import { DragPiece, JigsawConfig } from '../types';
import Piece from './Piece';
import { useEffect, useRef, useState } from 'react';
import { getMousePosWithinElement } from '../utils/dom';
import { keyboardShortcuts } from '../constants/keyboardShortcuts';
import {
  PIECE_ROTATION_AMOUNT,
  PIECE_ROTATION_INTERVAL,
} from '../constants/uiConfig';
import useGame from '../hooks/useGame';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const JIGSAW_WIDTH = 400;
const JIGSAW_HEIGHT = 300;
const COLUMNS = 3;
const ROWS = 2;

const CanvasWrapper = styled.div`
  outline: 7px solid #0099ff;
  height: ${CANVAS_HEIGHT}px;
  width: ${CANVAS_WIDTH}px;
  position: relative;
`;

export default function JigsawCanvas() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const game = useGame();
  const canvasRef = useRef<HTMLDivElement>();

  const jigsawConfig: JigsawConfig = Object.freeze({
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT,
    jigsawWidth: JIGSAW_WIDTH,
    jigsawHeight: JIGSAW_HEIGHT,
    columns: COLUMNS,
    rows: ROWS,
  });

  const { jigsawState, setPieceState, updatePieceRotation } =
    useJigsawState(jigsawConfig);

  const [dragPiece, setDragPiece] = useState<DragPiece | null>(null);
  const [rotating, setRotating] = useState<'clockwise' | 'anticlockwise'>(null);

  const { draggingPieceKey } = dragPiece || {};

  const updatePieceRotationInterval = useRef(null);

  const cancelDrag = () => {
    setDragPiece(null);
    setRotating(null);
    clearInterval(updatePieceRotationInterval.current);
  };

  useEffect(() => {
    if (rotating) {
      updatePieceRotationInterval.current = setInterval(() => {
        updatePieceRotation(draggingPieceKey, (prev) =>
          rotating === 'clockwise'
            ? prev + PIECE_ROTATION_AMOUNT
            : prev - PIECE_ROTATION_AMOUNT,
        );
      }, PIECE_ROTATION_INTERVAL);

      return () => clearInterval(updatePieceRotationInterval.current);
    }
  }, [rotating, draggingPieceKey, updatePieceRotation]);

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
        if (dragPiece) {
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
            jigsawConfig={jigsawConfig}
            onMouseDown={(e) => {
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
            }}
            isDragging={draggingPieceKey === pieceKey}
          />
        );
      })}
    </CanvasWrapper>
  );
}

import styled from 'styled-components';
import useJigsawState from '../hooks/useJigsawState';
import { DragState, JigsawConfig } from '../types';
import Piece from './Piece';
import { useRef, useState } from 'react';
import { getMousePosWithinElement } from '../utils/dom';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const JIGSAW_WIDTH = 400;
const JIGSAW_HEIGHT = 300;
const COLUMNS = 1;
const ROWS = 1;

const CanvasWrapper = styled.div`
  outline: 7px solid #0099ff;
  height: ${CANVAS_HEIGHT}px;
  width: ${CANVAS_WIDTH}px;
  position: relative;
`;

export default function JigsawCanvas() {
  const canvasRef = useRef<HTMLDivElement>();

  const jigsawConfig: JigsawConfig = Object.freeze({
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT,
    jigsawWidth: JIGSAW_WIDTH,
    jigsawHeight: JIGSAW_HEIGHT,
    columns: COLUMNS,
    rows: ROWS,
  });

  const { jigsawState, setPieceState } = useJigsawState(jigsawConfig);

  const [dragState, setDragState] = useState<DragState | null>(null);

  return (
    <CanvasWrapper
      ref={canvasRef}
      onMouseUp={() => setDragState(null)}
      onMouseLeave={() => setDragState(null)}
      onMouseMove={(e) => {
        if (dragState) {
          const { top, left } = getMousePosWithinElement(e, canvasRef.current);
          const pieceTop = top - dragState.pieceMouseOffsetY;
          const pieceLeft = left - dragState.pieceMouseOffsetX;
          setPieceState(dragState.draggingPieceKey, {
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

              setDragState({
                draggingPieceKey: pieceKey,
                pieceMouseOffsetX,
                pieceMouseOffsetY,
              });
            }}
            isDragging={dragState && dragState.draggingPieceKey === pieceKey}
          />
        );
      })}
    </CanvasWrapper>
  );
}

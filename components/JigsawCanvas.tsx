import styled from 'styled-components';
import Piece from './Piece';
import { useRef } from 'react';
import { keyboardShortcuts } from '../constants/keyboardShortcuts';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  JIGSAW_CONFIG,
} from '../constants/jigsawConfig';
import useGame from '../hooks/useGame';
import usePieceUpdates from '../hooks/usePieceUpdates';
import useUser from '../hooks/useUser';

const CanvasWrapper = styled.div`
  outline: 7px solid #0099ff;
  height: ${CANVAS_HEIGHT}px;
  width: ${CANVAS_WIDTH}px;
  position: relative;
`;

export default function JigsawCanvas() {
  const { jigsaw: jigsawState } = useGame();
  const { user } = useUser();

  const canvasRef = useRef<HTMLDivElement>(null);

  const {
    dragPieceInfo,
    setRotatingDirection,
    onCancelDrag,
    onDrag,
    onMouseDown,
  } = usePieceUpdates({ canvasRef });

  if (!jigsawState) {
    // TODO maybe enforce this through context?
    throw new Error('jigsawState not defined but it should be!!!');
  }

  if (!user) {
    throw new Error('TODO this should never happen');
  }

  const { draggingPieceKey } = dragPieceInfo || {};

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
      onMouseUp={() => onCancelDrag(true)}
      onMouseLeave={() => onCancelDrag()}
      onMouseMove={(e) => {
        if (dragPieceInfo) {
          onDrag(e);
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
              onMouseDown(e, pieceKey, pieceState);
            }}
            isDragging={draggingPieceKey === pieceKey}
          />
        );
      })}
    </CanvasWrapper>
  );
}

import CompositePiece from './CompositePiece';
import { useRef } from 'react';
import { keyboardShortcuts } from '../constants/keyboardShortcuts';
import useGame from '../hooks/useGame';
import usePieceUpdates from '../hooks/usePieceUpdates';
import useUser from '../hooks/useUser';
import ScaledCanvas from './ScaledCanvas';
import useSyncCursorPos from '../hooks/useSyncCursorPos';

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

  const syncCursorPos = useSyncCursorPos({ canvasRef });

  if (!jigsawState) {
    // TODO maybe enforce this through context?
    throw new Error('jigsawState not defined but it should be!!!');
  }

  if (!user) {
    throw new Error('TODO this should never happen');
  }

  const { draggingPieceKey } = dragPieceInfo || {};

  return (
    <ScaledCanvas
      canvasRef={canvasRef}
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
        syncCursorPos(e);
      }}
    >
      {Object.entries(jigsawState).map(([pieceKey, pieceState]) => {
        return (
          <CompositePiece
            key={pieceKey}
            pieceKey={pieceKey}
            pieceState={pieceState}
            onMouseDown={(e) => {
              onMouseDown(e, pieceKey, pieceState);
            }}
            isDragging={draggingPieceKey === pieceKey}
          />
        );
      })}
    </ScaledCanvas>
  );
}

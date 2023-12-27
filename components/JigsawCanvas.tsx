import CompositePiece from './CompositePiece';
import { useRef } from 'react';
import { keyboardShortcuts } from '../constants/keyboardShortcuts';
import useGame from '../hooks/useGame';
import usePieceUpdates from '../hooks/usePieceUpdates';
import useUser from '../hooks/useUser';
import ScaledCanvas from './ScaledCanvas';

export default function JigsawCanvas() {
  const { jigsaw: jigsawState } = useGame();
  const { user } = useUser();

  const canvasRef = useRef<HTMLDivElement>(null);

  const {
    dragPieceInfo,
    setRotatingDirection,
    onCancelDrag,
    onDragStart,
    onDragOver,
    onDrop,
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
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={() => onCancelDrag(false)}
    >
      {Object.entries(jigsawState).map(([pieceKey, pieceState]) => {
        return (
          <CompositePiece
            key={pieceKey}
            pieceKey={pieceKey}
            pieceState={pieceState}
            onDragStart={(e) => {
              onDragStart(e, pieceKey, pieceState);
            }}
            onDragEnd={() => onCancelDrag(false)}
            isDragging={draggingPieceKey === pieceKey}
          />
        );
      })}
    </ScaledCanvas>
  );
}

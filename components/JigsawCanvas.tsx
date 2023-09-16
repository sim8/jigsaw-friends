import styled from 'styled-components';
import useJigsawState from '../hooks/useJigsawState';
import { JigsawConfig, PieceKey } from '../types';
import Piece from './Piece';
import { useState } from 'react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const JIGSAW_WIDTH = 400;
const JIGSAW_HEIGHT = 300;
const COLUMNS = 3;
const ROWS = 3;

const CanvasWrapper = styled.div`
  outline: 7px solid #0099ff;
  height: ${CANVAS_HEIGHT}px;
  width: ${CANVAS_WIDTH}px;
  position: relative;
`;

export default function JigsawCanvas() {
  const jigsawConfig: JigsawConfig = Object.freeze({
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT,
    jigsawWidth: JIGSAW_WIDTH,
    jigsawHeight: JIGSAW_HEIGHT,
    columns: COLUMNS,
    rows: ROWS,
  });

  const jigsawState = useJigsawState(jigsawConfig);

  const [draggingKey, setDraggingKey] = useState<PieceKey | null>(null);

  return (
    <CanvasWrapper
      onMouseUp={() => setDraggingKey(null)}
      onMouseLeave={() => setDraggingKey(null)}
    >
      {Object.entries(jigsawState).map(([pieceKey, pieceState]) => {
        return (
          <Piece
            key={pieceKey}
            pieceKey={pieceKey}
            pieceState={pieceState}
            jigsawConfig={jigsawConfig}
            onMouseDown={() => setDraggingKey(pieceKey)}
            isDragging={draggingKey === pieceKey}
          />
        );
      })}
    </CanvasWrapper>
  );
}

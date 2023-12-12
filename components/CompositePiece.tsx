import { PieceKey, PieceState } from '../types';
import { MouseEventHandler } from 'react';
import PieceSvg from './PieceSvg';
import {
  getPieceHeight,
  getPieceWidth,
  getSolutionPieceVector,
} from '../utils/pieces';
import styled from 'styled-components';
import { PIECE_BOUNDING_BOX_SIZE_FACTOR } from '../constants/uiConfig';
import { COLORS } from '../constants/colors';
import useDebug from '../hooks/useDebug';
import useGame from '../hooks/useGame';

type Props = {
  pieceKey: PieceKey;
  pieceState: PieceState;
  isDragging: boolean;
  onMouseDown: MouseEventHandler<HTMLDivElement>;
};

const CompositePieceWrapper = styled.div`
  position: absolute;
  pointer-events: none;
`;

const PIECE_CENTER_DEBUG_SIZE = 20;

const PieceCenterDebug = styled.div`
  position: absolute;
  width: ${PIECE_CENTER_DEBUG_SIZE}px;
  height: ${PIECE_CENTER_DEBUG_SIZE}px;
  border-radius: ${PIECE_CENTER_DEBUG_SIZE / 2}px;
  z-index: 1;
  background-color: ${COLORS.ELECTRIC_BLUE};
`;

export default function CompositePiece({
  pieceKey,
  pieceState,
  isDragging,
  onMouseDown,
}: Props) {
  const { debugEnabled } = useDebug();
  const { rows, columns, jigsawWidth, jigsawHeight } = useGame();

  const pieceWidth = getPieceWidth(jigsawWidth, columns);
  const pieceHeight = getPieceHeight(jigsawHeight, rows);

  const { top, left, rotation, childPieces } = pieceState;

  const boundingBoxWidthOffset = pieceWidth / PIECE_BOUNDING_BOX_SIZE_FACTOR;
  const boundingBoxHeightOffset = pieceHeight / PIECE_BOUNDING_BOX_SIZE_FACTOR;

  return (
    <CompositePieceWrapper
      onMouseDown={(e) => {
        if (e.buttons == 1) {
          onMouseDown(e);
        }
      }}
      style={{
        // top/left relate to center of piece
        height: pieceHeight,
        width: pieceWidth,
        left: left - pieceWidth / 2,
        top: top - pieceHeight / 2,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <PieceSvg
        pieceKey={pieceKey}
        isDragging={isDragging}
        style={{
          top: -boundingBoxHeightOffset,
          left: -boundingBoxWidthOffset,
        }}
      />
      {childPieces &&
        Object.keys(childPieces).map((childKey) => {
          const childVector = getSolutionPieceVector({
            pieceAKey: pieceKey,
            pieceBKey: childKey,
            rows,
            columns,
            jigsawWidth,
            jigsawHeight,
          });
          return (
            <PieceSvg
              key={childKey}
              pieceKey={childKey}
              isDragging={isDragging}
              style={{
                left: childVector[0] - boundingBoxWidthOffset,
                top: childVector[1] - boundingBoxHeightOffset,
              }}
            />
          );
        })}

      {debugEnabled && (
        <PieceCenterDebug
          style={{
            left: `calc(50% - ${PIECE_CENTER_DEBUG_SIZE / 2}px)`,
            top: `calc(50% - ${PIECE_CENTER_DEBUG_SIZE / 2}px)`,
          }}
        />
      )}
    </CompositePieceWrapper>
  );
}

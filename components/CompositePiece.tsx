import { JigsawConfig, PieceKey, PieceState } from '../types';
import { MouseEventHandler } from 'react';
import Piece from './Piece';
import {
  getPieceHeight,
  getPieceWidth,
  getSolutionPieceVector,
} from '../utils/pieces';
import styled from 'styled-components';
import { PIECE_BOUNDING_BOX_SIZE_FACTOR } from '../constants/uiConfig';

type Props = {
  pieceKey: PieceKey;
  pieceState: PieceState;
  jigsawConfig: JigsawConfig;
  isDragging: boolean;
  onMouseDown: MouseEventHandler<HTMLDivElement>;
};

const CompositePieceWrapper = styled.div`
  position: absolute;
  pointer-events: none;
`;

export default function CompositePiece({
  pieceKey,
  pieceState,
  jigsawConfig,
  isDragging,
  onMouseDown,
}: Props) {
  const pieceWidth = getPieceWidth(
    jigsawConfig.jigsawWidth,
    jigsawConfig.columns,
  );
  const pieceHeight = getPieceHeight(
    jigsawConfig.jigsawHeight,
    jigsawConfig.rows,
  );

  const { top, left, rotation, childPieces } = pieceState;

  // TODO - child pieces a little tricky
  //   A - render all as children? Maybe simpler but less performant.
  //   B - render as one SVG? Bounding box would either need to be full puzzle or dynamically sized. Yuck
  //   C - nested SVGs??

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
      <Piece
        pieceKey={pieceKey}
        jigsawConfig={jigsawConfig}
        isDragging={isDragging}
        style={{
          top: -boundingBoxHeightOffset,
          left: -boundingBoxWidthOffset,
        }}
      />
      {childPieces &&
        Object.keys(childPieces).map((childKey) => {
          const childVector = getSolutionPieceVector(pieceKey, childKey);
          return (
            <Piece
              key={childKey}
              pieceKey={childKey}
              jigsawConfig={jigsawConfig}
              isDragging={isDragging}
              style={{
                left: childVector[0] - boundingBoxWidthOffset,
                top: childVector[1] - boundingBoxHeightOffset,
              }}
            />
          );
        })}
    </CompositePieceWrapper>
  );
}

import { JigsawConfig, PieceKey, PieceState } from '../types';
import { MouseEventHandler } from 'react';
import PieceSvg from './PieceSvg';
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
            <PieceSvg
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

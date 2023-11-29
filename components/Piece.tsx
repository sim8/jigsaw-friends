import styled from 'styled-components';
import { JigsawConfig, PieceKey, PieceState } from '../types';
import {
  getPieceFromKey,
  getPieceHeight,
  getSolutionPieceVector,
  getPieceWidth,
} from '../utils/pieces';
import { MouseEventHandler } from 'react';

const PieceDiv = styled.div<{ isDragging?: boolean }>`
  outline: 2px solid green;
  background-image: url('/images/test-image-1.jpg');
  position: absolute;
  cursor: ${({ isDragging }) => (isDragging ? 'grabbing' : 'grab')};
`;

type Props = {
  pieceKey: PieceKey;
  pieceState: PieceState;
  jigsawConfig: JigsawConfig;
  isDragging: boolean;
  onMouseDown: MouseEventHandler<SVGPathElement>;
};

export default function Piece({
  pieceKey,
  pieceState,
  jigsawConfig,
  isDragging,
  onMouseDown,
}: Props) {
  const { colIndex, rowIndex } = getPieceFromKey(pieceKey);

  const pieceWidth = getPieceWidth(
    jigsawConfig.jigsawWidth,
    jigsawConfig.columns,
  );
  const pieceHeight = getPieceHeight(
    jigsawConfig.jigsawHeight,
    jigsawConfig.rows,
  );

  const { top, left, rotation, childPieces } = pieceState;

  const sharedStyles = {
    backgroundSize: `${jigsawConfig.jigsawWidth}px ${jigsawConfig.jigsawHeight}px`,
    width: pieceWidth,
    height: pieceHeight,
  };

  if (pieceKey === '0,0') {
    return (
      <svg
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          top: top - pieceHeight / 2,
          left: left - pieceWidth / 2,
          width: pieceWidth * 2, // TODO - const for 2
          height: pieceHeight * 2, // TODO - const for 2
          transform: `rotate(${rotation}deg)`,
          border: '1px solid red',
        }}
        viewBox="0 0 100 100"
      >
        <path
          d="M25,25 L75,25 L75,75 L25,75 L25,25"
          style={{
            fill: 'blue',
            cursor: isDragging ? 'grabbing' : 'grab',
            pointerEvents: 'auto',
          }}
          onMouseDown={onMouseDown}
        />
      </svg>
    );
  }

  return (
    <PieceDiv
      onMouseDown={onMouseDown as MouseEventHandler}
      isDragging={isDragging}
      style={{
        ...sharedStyles,
        backgroundPositionX: -(pieceWidth * colIndex),
        backgroundPositionY: -(pieceHeight * rowIndex),
        top,
        left,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {childPieces &&
        Object.keys(childPieces).map((childKey) => {
          const { colIndex: childColIndex, rowIndex: childRowIndex } =
            getPieceFromKey(childKey);
          const childVector = getSolutionPieceVector(pieceKey, childKey);
          return (
            <PieceDiv
              key={childKey}
              style={{
                ...sharedStyles,
                backgroundPositionX: -(pieceWidth * childColIndex),
                backgroundPositionY: -(pieceHeight * childRowIndex),
                left: childVector[0],
                top: childVector[1],
              }}
            />
          );
        })}
    </PieceDiv>
  );
}

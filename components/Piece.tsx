import styled from 'styled-components';
import { JigsawConfig, PieceKey, PieceState } from '../types';
import {
  getPieceFromKey,
  getPieceHeight,
  getPieceWidth,
} from '../utils/pieces';
import { MouseEventHandler } from 'react';

const PieceDiv = styled.div<{ isDragging: boolean }>`
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
  onMouseDown: MouseEventHandler<HTMLElement>;
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

  const { top, left, rotation } = pieceState;

  return (
    <PieceDiv
      onMouseDown={onMouseDown}
      key={pieceKey}
      isDragging={isDragging}
      style={{
        backgroundSize: `${jigsawConfig.jigsawWidth}px ${jigsawConfig.jigsawHeight}px`,
        backgroundPositionX: -(pieceWidth * colIndex),
        backgroundPositionY: -(pieceHeight * rowIndex),
        width: pieceWidth,
        height: pieceHeight,
        top,
        left,
        transform: `rotate(${rotation}deg)`,
      }}
    />
  );
}

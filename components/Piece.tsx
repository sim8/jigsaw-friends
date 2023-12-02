import styled from 'styled-components';
import { JigsawConfig, PieceKey, PieceState } from '../types';
import {
  getPieceFromKey,
  getPieceHeight,
  getSolutionPieceVector,
  getPieceWidth,
} from '../utils/pieces';
import { MouseEventHandler } from 'react';

const PIECE_BOUNDING_BOX_SIZE_FACTOR = 2; // bounding box is X times bigger than actual piece
const ONE_HUNDRED = 100; // percentages used for svg viewbox

const VIEWBOX_PIECE_SIZE = ONE_HUNDRED / PIECE_BOUNDING_BOX_SIZE_FACTOR;
const BOUNDING_BOX_PADDING = (ONE_HUNDRED - VIEWBOX_PIECE_SIZE) / 2;

const PieceSvg = styled.svg<{ pieceWidth: number; pieceHeight: number }>`
  pointer-events: none;
  position: absolute;
  outline: 1px solid red;
  width: ${({ pieceWidth }) => pieceWidth * PIECE_BOUNDING_BOX_SIZE_FACTOR}px;
  height: ${({ pieceHeight }) =>
    pieceHeight * PIECE_BOUNDING_BOX_SIZE_FACTOR}px;
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

  console.log(
    '🚀 ~ file: Piece.tsx:49 ~ childPieces:',
    childPieces,
    getSolutionPieceVector,
  );

  console.log(pieceWidth, pieceHeight);

  return (
    <PieceSvg
      pieceWidth={pieceWidth}
      pieceHeight={pieceHeight}
      viewBox={`0 0 ${ONE_HUNDRED} ${ONE_HUNDRED}`}
      preserveAspectRatio="none"
      style={{
        // top/left relate to center of piece
        top: top - pieceHeight / 2,
        left: left - pieceWidth / 2,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <defs>
        <pattern
          id={pieceKey}
          patternUnits="userSpaceOnUse"
          width={ONE_HUNDRED}
          height={ONE_HUNDRED}
        >
          <image
            href="/images/test-image-1.jpg"
            x={BOUNDING_BOX_PADDING - VIEWBOX_PIECE_SIZE * colIndex}
            y={BOUNDING_BOX_PADDING - VIEWBOX_PIECE_SIZE * rowIndex}
            width={VIEWBOX_PIECE_SIZE * jigsawConfig.columns}
            height={VIEWBOX_PIECE_SIZE * jigsawConfig.rows}
            preserveAspectRatio="none"
          />
        </pattern>
      </defs>
      <path
        d="M25,25 L75,25 L75,75 L25,75 L25,25"
        fill={`url(#${pieceKey})`}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          pointerEvents: 'auto',
        }}
        onMouseDown={onMouseDown}
      />
    </PieceSvg>
  );
}

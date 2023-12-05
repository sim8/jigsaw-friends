import styled from 'styled-components';
import { JigsawConfig, PieceKey } from '../types';
import {
  getPieceFromKey,
  getPieceHeight,
  getPieceWidth,
} from '../utils/pieces';
import { CSSProperties } from 'react';
import { PIECE_BOUNDING_BOX_SIZE_FACTOR } from '../constants/uiConfig';
import useDebug from '../hooks/useDebug';

const ONE_HUNDRED = 100; // percentages used for svg viewbox

const VIEWBOX_PIECE_SIZE = ONE_HUNDRED / PIECE_BOUNDING_BOX_SIZE_FACTOR;
const BOUNDING_BOX_PADDING = (ONE_HUNDRED - VIEWBOX_PIECE_SIZE) / 2;

const PieceSvg = styled.svg<{
  pieceWidth: number;
  pieceHeight: number;
  debugEnabled: boolean;
}>`
  pointer-events: none;
  position: absolute;
  width: ${({ pieceWidth }) => pieceWidth * PIECE_BOUNDING_BOX_SIZE_FACTOR}px;
  height: ${({ pieceHeight }) =>
    pieceHeight * PIECE_BOUNDING_BOX_SIZE_FACTOR}px;
  ${({ debugEnabled }) =>
    debugEnabled &&
    `
  outline: 1px solid red;
  `}
`;

type Props = {
  pieceKey: PieceKey;
  jigsawConfig: JigsawConfig;
  isDragging: boolean;
  style?: CSSProperties;
};

export default function Piece({
  pieceKey,
  jigsawConfig,
  isDragging,
  style,
}: Props) {
  const { debugEnabled } = useDebug();
  const { colIndex, rowIndex } = getPieceFromKey(pieceKey);

  const pieceWidth = getPieceWidth(
    jigsawConfig.jigsawWidth,
    jigsawConfig.columns,
  );
  const pieceHeight = getPieceHeight(
    jigsawConfig.jigsawHeight,
    jigsawConfig.rows,
  );

  return (
    <PieceSvg
      pieceWidth={pieceWidth}
      pieceHeight={pieceHeight}
      debugEnabled={debugEnabled}
      viewBox={`0 0 ${ONE_HUNDRED} ${ONE_HUNDRED}`}
      preserveAspectRatio="none"
      style={style}
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
      />
    </PieceSvg>
  );
}

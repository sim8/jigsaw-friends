import { PieceKey, PieceState } from '../types';
import PieceSvg from './PieceSvg';
import {
  getPieceHeight,
  getPieceWidth,
  getSolutionPieceVector,
} from '../utils/pieces';
import styled from 'styled-components';
import {
  PIECE_BOUNDING_BOX_SIZE_FACTOR,
  PIECE_PICK_UP_ANIMATION_TIME,
  PIECE_PUT_DOWN_ANIMATION_TIME,
} from '../constants/uiConfig';
import { COLORS } from '../constants/colors';
import useDebug from '../hooks/useDebug';
import useGame from '../hooks/useGame';

const HELD_PIECE_MINIMUM_OFFSET = 15;

type Props = {
  pieceKey: PieceKey;
  pieceState: PieceState;
  isDragging: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

type CompositePieceWrapperProps = { isHeld: boolean; pieceWidth: number };

function getFilter({ isHeld, pieceWidth }: CompositePieceWrapperProps) {
  const offsetY = pieceWidth / (isHeld ? 18 : 60);
  const standardDeviation = pieceWidth / (isHeld ? 37 : 185);
  return `drop-shadow(0px ${offsetY}px ${standardDeviation}px #333)`;
}

function getTransform({ isHeld, pieceWidth }: CompositePieceWrapperProps) {
  if (!isHeld) {
    return 'translate(0, 0)';
  }
  const offsetY = HELD_PIECE_MINIMUM_OFFSET + pieceWidth / 123;
  return `translate(0, -${offsetY}px) scale(1.01)`;
}

const getAnimationTime = ({ isHeld }: CompositePieceWrapperProps) =>
  `${isHeld ? PIECE_PICK_UP_ANIMATION_TIME : PIECE_PUT_DOWN_ANIMATION_TIME}ms`;

const CompositePieceWrapper = styled.div<CompositePieceWrapperProps>`
  position: absolute;
  pointer-events: none;
  filter: ${getFilter};
  transform: ${getTransform};
  transition:
    transform ${getAnimationTime},
    filter ${getAnimationTime};
`;

const RotationWrapper = styled.div`
  position: absolute;
  pointer-events: none;
  height: 100%;
  width: 100%;
`;

const PIECE_CENTER_DEBUG_SIZE = 100;

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
  ...divProps
}: Props) {
  const { debugEnabled } = useDebug();
  const { rows, columns, jigsawWidth, jigsawHeight } = useGame();

  const pieceWidth = getPieceWidth(jigsawWidth, columns);
  const pieceHeight = getPieceHeight(jigsawHeight, rows);

  const { top, left, rotation, childPieces, heldBy } = pieceState;

  const boundingBoxWidthOffset = pieceWidth / PIECE_BOUNDING_BOX_SIZE_FACTOR;
  const boundingBoxHeightOffset = pieceHeight / PIECE_BOUNDING_BOX_SIZE_FACTOR;

  return (
    <CompositePieceWrapper
      pieceWidth={pieceWidth}
      isHeld={!!heldBy}
      draggable={!heldBy}
      {...divProps}
      style={{
        // top/left relate to center of piece
        height: pieceHeight,
        width: pieceWidth,
        left: left - pieceWidth / 2,
        top: top - pieceHeight / 2,
      }}
    >
      <RotationWrapper
        style={{
          // rotations + drop-shadows need to be on separate elements
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
      </RotationWrapper>
    </CompositePieceWrapper>
  );
}

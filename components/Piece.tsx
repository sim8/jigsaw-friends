import { JigsawConfig, PieceKey, PieceState } from '../types';
import {
  getPieceFromKey,
  getPieceHeight,
  getPieceWidth,
} from '../utils/pieces';

type Props = {
  pieceKey: PieceKey;
  pieceState: PieceState;
  jigsawConfig: JigsawConfig;
};

export default function Piece({ pieceKey, pieceState, jigsawConfig }: Props) {
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
    <div
      key={pieceKey}
      style={{
        outline: '2px solid green',
        backgroundImage: 'url("images/test-image-1.jpg")',
        backgroundSize: `${jigsawConfig.jigsawWidth}px ${jigsawConfig.jigsawHeight}px`,
        backgroundPositionX: pieceWidth * colIndex,
        backgroundPositionY: pieceHeight * rowIndex,
        width: pieceWidth,
        height: pieceHeight,

        position: 'absolute',
        top,
        left,
        transform: `rotate(${rotation}deg)`,
      }}
    />
  );
}

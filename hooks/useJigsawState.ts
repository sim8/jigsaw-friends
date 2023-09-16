import { useState } from 'react';
import { generateJigsawState } from '../lib/jigsawGeneration';
import { JigsawConfig, PieceKey, PieceState } from '../types';

export default function useJigsawState(jigsawConfig: JigsawConfig) {
  const [jigsawState, setJigsawState] = useState(() =>
    generateJigsawState(jigsawConfig),
  );

  const setPieceState = (
    pieceKey: PieceKey,
    pieceState: Partial<PieceState>,
  ) => {
    setJigsawState((prev) => ({
      ...prev,
      [pieceKey]: {
        ...prev[pieceKey],
        ...pieceState,
      },
    }));
  };

  return { jigsawState, setPieceState };
}

import { useState } from 'react';
import { generateJigsawState } from '../lib/jigsawGeneration';
import { JigsawConfig } from '../types';

export default function useJigsawState(jigsawConfig: JigsawConfig) {
  const [jigsawState, setJigsawState] = useState(() =>
    generateJigsawState(jigsawConfig),
  );

  return jigsawState;
}

import { useState } from 'react';
import { generateJigsawState } from '../lib/jigsawGeneration';
import { JigsawConfig } from '../types';

export default function useJigsawState(jigsawConfig: JigsawConfig) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [jigsawState, __setJigsawState] = useState(() =>
    generateJigsawState(jigsawConfig),
  );

  return jigsawState;
}

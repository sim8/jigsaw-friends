import { useContext } from 'react';
import { GameContext } from '../contexts/GameContextProviderWithLoadingState';
import { CONTEXT_NOT_PROVIDED } from '../constants/app';

export default function useGame() {
  const gameContext = useContext(GameContext);

  if (gameContext === CONTEXT_NOT_PROVIDED) {
    throw new Error('Using GameContext without it being provided');
  }

  return gameContext;
}

import { useContext } from 'react';
import { GameContext, NOT_PROVIDED } from '../contexts/GameContextProvider';

export default function useGame() {
  const gameContext = useContext(GameContext);

  if (gameContext === NOT_PROVIDED) {
    throw new Error('Using GameContext without it being provided');
  }

  return gameContext;
}

import { GameKey } from '../types';

export const getGameLink = (gameKey: GameKey, fullUrl?: boolean) => {
  const path = `/play/${gameKey}`;
  return fullUrl ? `${window.location.origin}${path}` : path;
};

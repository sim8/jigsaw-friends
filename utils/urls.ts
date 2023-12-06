import { GameKey, JigsawImage } from '../types';

export const getGameLink = (gameKey: GameKey, fullUrl?: boolean) => {
  const path = `/play/${gameKey}`;
  return fullUrl ? `${window.location.origin}${path}` : path;
};

export const getImagePath = (filename: JigsawImage['filename']) =>
  `/images/jigsaws/${filename}`;

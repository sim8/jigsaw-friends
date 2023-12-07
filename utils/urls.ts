import { GameKey, BuiltInJigsawImage } from '../types';

export const getGameLink = (gameKey: GameKey, fullUrl?: boolean) => {
  const path = `/play/${gameKey}`;
  return fullUrl ? `${window.location.origin}${path}` : path;
};

export const getBuiltInImagePath = (filename: BuiltInJigsawImage['filename']) =>
  `/images/jigsaws/${filename}`;

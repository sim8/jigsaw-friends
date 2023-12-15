import { PIECE_BOUNDING_BOX_SIZE_FACTOR } from '../constants/uiConfig';
import { Coordinates } from '../types';

const BOUNDING_BOX_MIDPOINT = 100 / 2;

const scaleCoordinateForBoundingBox = (coordinate: number) => {
  const distanceFromCenter = BOUNDING_BOX_MIDPOINT - coordinate;
  return (
    BOUNDING_BOX_MIDPOINT - distanceFromCenter / PIECE_BOUNDING_BOX_SIZE_FACTOR
  );
};

export function scaleForBoundingBox([x, y]: Coordinates): Coordinates {
  return [scaleCoordinateForBoundingBox(x), scaleCoordinateForBoundingBox(y)];
}

export function flipVertically([x, y]: Coordinates): Coordinates {
  return [x, -y];
}

export function rotateClockwise(
  [x, y]: Coordinates,
  times: number,
): Coordinates {
  switch (times) {
    case 1:
      return [100 - y, x];
    case 2:
      return [100 - x, 100 - y];
    case 3:
      return [y, 100 - x];
    default:
      return [x, y];
  }
}

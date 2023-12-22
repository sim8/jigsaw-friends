import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants/uiConfig';

export function getOverlayPositioningStyles({
  top,
  left,
}: {
  top: number;
  left: number;
}) {
  return {
    top: `${(top / CANVAS_HEIGHT) * 100}%`,
    left: `${(left / CANVAS_WIDTH) * 100}%`,
  };
}

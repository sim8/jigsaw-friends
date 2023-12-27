import { DragEvent } from 'react';

export function getMousePosWithinElement(
  e: DragEvent<HTMLDivElement>,
  el: HTMLElement,
) {
  const canvasRect = el.getBoundingClientRect();
  const left = e.clientX - canvasRect.left;
  const top = e.clientY - canvasRect.top;

  // these should be almost equal
  const scaleFactorX = el.clientWidth / canvasRect.width;
  const scaleFactorY = el.clientHeight / canvasRect.height;

  return { left: left * scaleFactorX, top: top * scaleFactorY };
}

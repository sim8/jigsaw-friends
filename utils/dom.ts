import { MouseEvent } from 'react';

export function getMousePosWithinElement(
  e: MouseEvent<HTMLDivElement>,
  el: HTMLElement,
) {
  const canvasRect = el.getBoundingClientRect();
  const left = e.clientX - canvasRect.left;
  const top = e.clientY - canvasRect.top;

  const scaleFactor = el.clientWidth / canvasRect.width; // assume same for width + height
  return { left: left * scaleFactor, top: top * scaleFactor };
}

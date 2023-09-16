import { MouseEvent } from 'react';

export function getMousePosWithinElement(
  e: MouseEvent<HTMLElement>,
  el: HTMLElement,
) {
  const canvasRect = el.getBoundingClientRect();
  const left = e.clientX - canvasRect.left;
  const top = e.clientY - canvasRect.top;
  return { left, top };
}

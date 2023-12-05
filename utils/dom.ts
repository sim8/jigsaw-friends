import { MouseEvent } from 'react';

// TODO can we replace this with pos within canvas? Might be simpler
export function getMousePosWithinElement(
  e: MouseEvent<HTMLDivElement>,
  el: HTMLElement,
) {
  const canvasRect = el.getBoundingClientRect();
  const left = e.clientX - canvasRect.left;
  const top = e.clientY - canvasRect.top;
  return { left, top };
}

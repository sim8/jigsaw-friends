import styled from 'styled-components';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/uiConfig';
import { RefObject, useCallback, useRef, useState } from 'react';
import useResizeObserver from '../hooks/useResizeObserver';

const CanvasWrapper = styled.div`
  width: 100vw;
  height: 100vh; // TODO change. Just for the sake of getting resize observer working
  position: fixed;
  top: 0;
  left: 0;
  border: 3px solid yellow;
  box-sizing: border-box;
`;

const Canvas = styled.div`
  position: absolute;

  width: ${CANVAS_WIDTH}px;
  height: ${CANVAS_HEIGHT}px;

  outline: 4px solid orange;

  top: 50%;
  left: 50%;
`;

const UnscaledOverlay = styled.div`
  position: absolute;
  pointer-events: none;

  width: ${CANVAS_WIDTH}px;
  height: ${CANVAS_HEIGHT}px;

  outline: 4px solid green;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

type Props = React.HTMLAttributes<HTMLDivElement> & {
  canvasRef: RefObject<HTMLDivElement>;
  unscaledOverlayChildren: React.ReactNode;
};

export default function ScaledCanvas({
  canvasRef,
  unscaledOverlayChildren,
  ...props
}: Props) {
  const [scaleFactor, setScaleFactor] = useState(0.9);

  const adjustScaleFactor = useCallback((entries: ResizeObserverEntry[]) => {
    const { width, height } = entries[0].contentRect;

    const scaleFactor = Math.min(width / CANVAS_WIDTH, height / CANVAS_HEIGHT);
    setScaleFactor(scaleFactor);
  }, []);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useResizeObserver(wrapperRef, adjustScaleFactor);

  return (
    <CanvasWrapper ref={wrapperRef}>
      <Canvas
        ref={canvasRef}
        style={{
          transform: `translate(-50%, -50%) scale(${scaleFactor})`,
        }}
        {...props}
      />
      <UnscaledOverlay
        style={{
          width: CANVAS_WIDTH * scaleFactor,
          height: CANVAS_HEIGHT * scaleFactor,
        }}
      >
        {unscaledOverlayChildren}
      </UnscaledOverlay>
    </CanvasWrapper>
  );
}

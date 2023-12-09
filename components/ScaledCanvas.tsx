import styled from 'styled-components';
import { CANVAS_WIDTH_V2, CANVAS_HEIGHT_V2 } from '../constants/jigsawConfig';
import { useCallback, useRef, useState } from 'react';
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

const Canvas = styled.div<{ scaleFactor: number }>`
  position: absolute;

  width: ${CANVAS_WIDTH_V2}px;
  height: ${CANVAS_HEIGHT_V2}px;
  transform: translate(-50%, -50%) scale(${({ scaleFactor }) => scaleFactor});

  border: 4px solid orange;

  top: 50%;
  left: 50%;
`;

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function ScaledCanvas({ ...props }: Props) {
  const [scaleFactor, setScaleFactor] = useState(0.9);

  const adjustScaleFactor = useCallback((entries: ResizeObserverEntry[]) => {
    const { width, height } = entries[0].contentRect;

    const scaleFactor = Math.min(
      width / CANVAS_WIDTH_V2,
      height / CANVAS_HEIGHT_V2,
    );
    setScaleFactor(scaleFactor);
  }, []);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useResizeObserver(wrapperRef, adjustScaleFactor);

  return (
    <CanvasWrapper ref={wrapperRef}>
      <Canvas {...props} scaleFactor={scaleFactor} />
    </CanvasWrapper>
  );
}

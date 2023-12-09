import { MutableRefObject, useEffect } from 'react';

export default function useResizeObserver(
  elementRef: MutableRefObject<HTMLElement | null>,
  memoizedCallback: ResizeObserverCallback,
) {
  useEffect(() => {
    const handleResizeObserver = new ResizeObserver(memoizedCallback);

    if (elementRef.current) {
      handleResizeObserver.observe(elementRef.current);
    }

    return () => handleResizeObserver.disconnect();
  }, [elementRef, memoizedCallback]);
}

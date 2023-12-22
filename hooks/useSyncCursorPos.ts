import { MouseEvent, RefObject, useCallback, useMemo } from 'react';
import useGame from './useGame';
import useUser from './useUser';
import { getMousePosWithinElement } from '../utils/dom';
import { throttle } from '../utils/misc';
import { SYNC_CURSOR_THROTTLE_INTERVAL } from '../constants/uiConfig';
import { setCursorPos } from '../lib/actions';

export default function useSyncCursorPos({
  canvasRef,
}: {
  canvasRef: RefObject<HTMLDivElement>;
}) {
  const { gameKey } = useGame();
  const { user } = useUser();

  if (!user) {
    // TODO maybe enforce this through context?
    throw new Error('TODO this should never happen');
  }

  const syncCursorPos = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!canvasRef.current) {
        return;
      }
      const { top, left } = getMousePosWithinElement(e, canvasRef.current);
      setCursorPos({
        top,
        left,
        gameKey,
        uid: user.uid,
      });
    },
    [gameKey, user.uid, canvasRef],
  );

  return useMemo(
    () => throttle(syncCursorPos, SYNC_CURSOR_THROTTLE_INTERVAL),
    [syncCursorPos],
  );
}

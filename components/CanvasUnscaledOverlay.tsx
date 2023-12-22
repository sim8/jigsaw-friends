import useGame from '../hooks/useGame';
import useUser from '../hooks/useUser';
import PlayerCursor from './PlayerCursor';

export default function CanvasUnscaledOverlay() {
  // todo - separate listener for this
  const { liveUsersCursorPos } = useGame();
  const { user } = useUser();

  if (!user) {
    throw new Error('TODO');
  }

  return (
    <>
      {liveUsersCursorPos &&
        Object.entries(liveUsersCursorPos).map(([uid, { top, left }]) =>
          uid !== user.uid ? (
            <PlayerCursor key={uid} uid={uid} top={top} left={left} />
          ) : null,
        )}
    </>
  );
}

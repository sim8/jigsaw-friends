import { useCallback, useMemo } from 'react';
import useGame from '../hooks/useGame';
import { setName, startGame } from '../lib/actions';
import { getGameLink } from '../utils/urls';
import useUser from '../hooks/useUser';

export default function Lobby() {
  const { gameKey, liveUsers } = useGame();
  const { user } = useUser();

  const orderedLiveUserIds = useMemo(
    () =>
      Object.entries(liveUsers)
        .sort(([, a], [, b]) => a.joinedAt - b.joinedAt)
        .map(([uid]) => uid),
    [liveUsers],
  );

  const copyInviteLink = useCallback(() => {
    const link = getGameLink(gameKey, true);
    navigator.clipboard.writeText(link);
  }, [gameKey]);

  return (
    <div>
      <h1>Lobby</h1>
      <ol>
        {orderedLiveUserIds.map((uid, index) => (
          <div key={uid}>
            {user && user.uid === uid ? (
              <input
                type="text"
                placeholder="Type name here"
                value={liveUsers[uid].name || ''}
                onChange={(e) => setName(gameKey, user.uid, e.target.value)}
              />
            ) : (
              liveUsers[uid].name || `Player ${index + 1}`
            )}
          </div>
        ))}
      </ol>
      <button onClick={() => startGame(gameKey)}>Play</button>
      <button onClick={() => copyInviteLink()}>Copy invite link</button>
    </div>
  );
}

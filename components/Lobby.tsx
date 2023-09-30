import { useCallback } from 'react';
import useGame from '../hooks/useGame';
import { startGame } from '../lib/actions';
import { getGameLink } from '../utils/urls';

export default function Lobby() {
  const { gameKey } = useGame();

  const copyInviteLink = useCallback(() => {
    const link = getGameLink(gameKey, true);
    navigator.clipboard.writeText(link);
  }, [gameKey]);

  return (
    <div>
      <h1>Lobby</h1>
      <button onClick={() => startGame(gameKey)}>Play</button>
      <button onClick={() => copyInviteLink()}>Copy invite link</button>
    </div>
  );
}

import { useEffect } from 'react';
import useGame from './useGame';
import useUser from './useUser';
import { joinGame } from '../lib/actions';

export default function useJoinGame() {
  const { user } = useUser();
  const { gameKey, liveUsers } = useGame();

  // TODO https://github.com/sim8/jigsaw-friends/issues/9
  const { uid } = user || {};

  // TODO https://github.com/sim8/jigsaw-friends/issues/9
  const isInGame = uid && uid in liveUsers;

  useEffect(() => {
    // TODO https://github.com/sim8/jigsaw-friends/issues/9
    if (!isInGame && uid) {
      joinGame(gameKey, uid);
    }
  }, [isInGame, gameKey, uid]);

  return null;
}

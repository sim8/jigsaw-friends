import GameContextProviderWithLoadingState from '../contexts/GameContextProviderWithLoadingState';
import { useRouter } from 'next/router';
import RequiresAuth from './RequiresAuth';
import LobbyOrGame from './LobbyOrGame';

export default function GameContainer() {
  const router = useRouter();
  const { gameId } = router.query;

  const gameKey = Array.isArray(gameId) ? gameId[0] : gameId; // satisfy TS, never an array here

  if (!gameKey) {
    return null;
  }
  return (
    <RequiresAuth>
      <GameContextProviderWithLoadingState
        gameKey={gameKey}
        loadingState={<>{'Loading...'}</>}
      >
        <LobbyOrGame />
      </GameContextProviderWithLoadingState>
    </RequiresAuth>
  );
}

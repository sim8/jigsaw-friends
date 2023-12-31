import GameContextProviderWithLoadingState from '../contexts/GameContextProviderWithLoadingState';
import { useRouter } from 'next/router';
import RequiresAuth from './RequiresAuth';
import LobbyOrGame from './LobbyOrGame';
import ErrorBoundary from './ErrorBoundary';
import DebugContextProvider from '../contexts/DebugContextProvider';

export default function GameContainer() {
  const router = useRouter();
  const { gameId } = router.query;

  const gameKey = Array.isArray(gameId) ? gameId[0] : gameId; // satisfy TS, never an array here

  if (!gameKey) {
    return null;
  }
  return (
    <RequiresAuth>
      <ErrorBoundary>
        <DebugContextProvider>
          <GameContextProviderWithLoadingState
            gameKey={gameKey}
            loadingState={<>{'Loading...'}</>}
          >
            <LobbyOrGame />
          </GameContextProviderWithLoadingState>
        </DebugContextProvider>
      </ErrorBoundary>
    </RequiresAuth>
  );
}

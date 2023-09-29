import GameContextProvider from '../contexts/GameContextProvider';
import { useRouter } from 'next/router';
import JigsawCanvas from './JigsawCanvas';
import RequiresAuth from './RequiresAuth';

export default function GameContainer() {
  const router = useRouter();
  const { gameId } = router.query;

  const gameKey = Array.isArray(gameId) ? gameId[0] : gameId; // satisfy TS, never an array here

  if (!gameKey) {
    return null;
  }
  return (
    <RequiresAuth>
      <GameContextProvider gameKey={gameKey}>
        <JigsawCanvas />
      </GameContextProvider>
    </RequiresAuth>
  );
}

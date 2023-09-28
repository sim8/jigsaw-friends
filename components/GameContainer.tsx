import GameContextProvider from '../contexts/GameContextProvider';
import { useRouter } from 'next/router';
import JigsawCanvas from './JigsawCanvas';

export default function GameContainer() {
  const router = useRouter();
  const { gameId } = router.query;

  const gameKey = Array.isArray(gameId) ? gameId[0] : gameId; // satisfy TS, never an array here
  return (
    <GameContextProvider gameKey={gameKey}>
      <JigsawCanvas />
    </GameContextProvider>
  );
}

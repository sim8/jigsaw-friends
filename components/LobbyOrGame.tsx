import useGame from '../hooks/useGame';
import useJoinGame from '../hooks/useJoinGame';
import DebugControls from './DebugControls';
import JigsawCanvas from './JigsawCanvas';
import Lobby from './Lobby';

export default function LobbyOrGame() {
  const game = useGame();
  useJoinGame();

  return (
    <>
      {game.startedAt ? <JigsawCanvas /> : <Lobby />}
      <DebugControls />
    </>
  );
}

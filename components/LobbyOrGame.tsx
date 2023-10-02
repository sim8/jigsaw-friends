import useGame from '../hooks/useGame';
import useJoinGame from '../hooks/useJoinGame';
import JigsawCanvas from './JigsawCanvas';
import Lobby from './Lobby';

export default function LobbyOrGame() {
  const game = useGame();
  useJoinGame();

  if (game.startedAt) {
    return <JigsawCanvas />;
  }
  return <Lobby />;
}

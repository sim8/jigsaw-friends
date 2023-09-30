import useGame from '../hooks/useGame';
import JigsawCanvas from './JigsawCanvas';
import Lobby from './Lobby';

export default function LobbyOrGame() {
  const game = useGame();

  if (game.startedAt) {
    return <JigsawCanvas />;
  }
  return <Lobby />;
}

import useGame from '../hooks/useGame';
import { startGame } from '../lib/actions';

export default function Lobby() {
  const { gameKey } = useGame();

  return (
    <div>
      <h1>Lobby</h1>
      <button onClick={() => startGame(gameKey)}>Play</button>
    </div>
  );
}

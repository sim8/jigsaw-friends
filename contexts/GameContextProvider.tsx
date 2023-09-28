import { useState, useEffect, createContext } from 'react';
import { getFirebase } from '../firebase/clientApp';
import { Game, GameKey } from '../types';
import { ref, onValue } from 'firebase/database';

export const NOT_PROVIDED = 'NOT_PROVIDED';

export const GameContext = createContext<Game | null | typeof NOT_PROVIDED>(
  NOT_PROVIDED,
);

export default function GameContextProvider({
  children,
  gameKey,
}: {
  gameKey: GameKey;
  children: React.ReactNode;
}) {
  const [game, setGame] = useState<Game>(null);

  useEffect(() => {
    const { database } = getFirebase();

    const gameRef = ref(database, `games/${gameKey}`);
    const unsubscriber = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      setGame(data);
    });

    return () => unsubscriber();
  }, [gameKey]);

  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
}

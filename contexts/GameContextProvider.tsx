import { useState, useEffect, createContext } from 'react';
import { getFirebase } from '../firebase/clientApp';
import { Game, GameKey } from '../types';
import { ref, onValue } from 'firebase/database';
import { CONTEXT_NOT_PROVIDED } from '../constants/app';

type GameState = Game | null;

export const GameContext = createContext<
  GameState | typeof CONTEXT_NOT_PROVIDED
>(CONTEXT_NOT_PROVIDED);

export default function GameContextProvider({
  children,
  gameKey,
}: {
  gameKey: GameKey;
  children: React.ReactNode;
}) {
  const [game, setGame] = useState<GameState>(null);

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

import { useState, useEffect, createContext } from 'react';
import { getFirebase } from '../firebase/clientApp';
import { Game, GameKey, GameWithKey } from '../types';
import { ref, onValue } from 'firebase/database';
import { CONTEXT_NOT_PROVIDED } from '../constants/app';

export const GameContext = createContext<
  GameWithKey | typeof CONTEXT_NOT_PROVIDED
>(CONTEXT_NOT_PROVIDED);

export default function GameContextProviderWithLoadingState({
  children,
  gameKey,
  loadingState,
}: {
  gameKey: GameKey;
  children: React.ReactNode;
  loadingState: React.ReactNode;
}) {
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    const { database } = getFirebase();

    const gameRef = ref(database, `games/${gameKey}`);
    const unsubscriber = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      setGame(data);
    });

    return () => unsubscriber();
  }, [gameKey]);

  if (game === null) {
    return <>{loadingState}</>;
  }

  return (
    <GameContext.Provider value={{ ...game, gameKey }}>
      {children}
    </GameContext.Provider>
  );
}

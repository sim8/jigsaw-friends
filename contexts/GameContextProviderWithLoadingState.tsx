import { useState, useEffect, createContext } from 'react';
import { getFirebase } from '../firebase/clientApp';
import { Game, GameKey, GameContextType } from '../types';
import { ref, onValue } from 'firebase/database';
import { CONTEXT_NOT_PROVIDED } from '../constants/app';
import { getColumnsRowsFromKey } from '../utils/settings';
import useImageDimensions from '../hooks/useImageDimensions';

export const GameContext = createContext<
  GameContextType | typeof CONTEXT_NOT_PROVIDED
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

  const { height: imageHeight, width: imageWidth } = useImageDimensions(
    game && game.settings.url,
  );

  if (game === null) {
    return <>{loadingState}</>;
  }

  const [columns, rows] = getColumnsRowsFromKey(game.settings.columnsRowsKey);

  return (
    <GameContext.Provider
      value={{ ...game, gameKey, columns, rows, imageHeight, imageWidth }}
    >
      {children}
    </GameContext.Provider>
  );
}

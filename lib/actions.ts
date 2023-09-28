import { signInAnonymously } from 'firebase/auth';
import { ref, child, push } from 'firebase/database';
import { getFirebase } from '../firebase/clientApp';
import { Game, GameKey } from '../types';

const createGame = (): GameKey => {
  const { database, auth } = getFirebase();

  const gameData: Game = {
    host: auth.currentUser.uid,
  };

  // Get a key for a new game.
  const newGameKey = push(child(ref(database), 'games'), gameData).key;

  return newGameKey;
};

export const signInAndCreateGame = () => {
  const { auth } = getFirebase();
  return signInAnonymously(auth)
    .then(() => createGame())
    .catch((error) => {
      console.log(error);
      // TODO
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // ...
    });
};

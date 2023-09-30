import { UserCredential, signInAnonymously } from 'firebase/auth';
import { ref, child, push, set, serverTimestamp } from 'firebase/database';
import { getFirebase } from '../firebase/clientApp';
import { Game, GameKey } from '../types';

const createGame = (userCredential: UserCredential): GameKey | null => {
  const { database } = getFirebase();

  const gameData: Game = {
    host: userCredential.user.uid,
  };

  // Get a key for a new game.
  const newGameKey = push(child(ref(database), 'games'), gameData).key;

  return newGameKey;
};

export function signIn() {
  const { auth } = getFirebase();
  return signInAnonymously(auth);
}

export function signInAndCreateGame() {
  return signIn()
    .then(createGame)
    .catch((error) => {
      console.log(error);
      // TODO
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // ...
    });
}

export function startGame(gameKey: GameKey) {
  const { database } = getFirebase();
  set(ref(database, `games/${gameKey}/startedAt`), serverTimestamp());
}

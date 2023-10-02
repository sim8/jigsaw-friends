import { UserCredential, signInAnonymously } from 'firebase/auth';
import { ref, child, push, set, serverTimestamp } from 'firebase/database';
import { getFirebase } from '../firebase/clientApp';
import { Game, GameKey } from '../types';

const createGame = (userCredential: UserCredential): GameKey | null => {
  const { database } = getFirebase();

  const { uid } = userCredential.user;

  const gameData: Game = {
    host: uid,
    liveUsers: {
      [uid]: {
        // TODO not sure if we can do better typing here
        joinedAt: serverTimestamp() as unknown as number,
      },
    },
  };

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

export function joinGame(gameKey: GameKey, uid: string) {
  const { database } = getFirebase();
  set(ref(database, `games/${gameKey}/liveUsers/${uid}`), {
    joinedAt: serverTimestamp(),
  });
}

export function setName(gameKey: GameKey, uid: string, name: string) {
  const { database } = getFirebase();
  set(ref(database, `games/${gameKey}/liveUsers/${uid}/name`), name);
}

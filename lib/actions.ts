import { UserCredential, signInAnonymously } from 'firebase/auth';
import {
  ref,
  child,
  push,
  set,
  update,
  runTransaction,
  serverTimestamp,
} from 'firebase/database';
import { getFirebase } from '../firebase/clientApp';
import { Game, GameKey, PieceKey, Uid } from '../types';
import { generateJigsawState } from './jigsawGeneration';
import { JIGSAW_CONFIG } from '../constants/jigsawConfig';
import { PIECE_ROTATION_AMOUNT } from '../constants/uiConfig';

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

export function startGame({ gameKey }: { gameKey: GameKey }) {
  const { database } = getFirebase();
  update(ref(database), {
    [`games/${gameKey}/startedAt`]: serverTimestamp(),
    [`games/${gameKey}/jigsaw`]: generateJigsawState(JIGSAW_CONFIG),
  });
}

export function joinGame({ gameKey, uid }: { gameKey: GameKey; uid: string }) {
  const { database } = getFirebase();
  set(ref(database, `games/${gameKey}/liveUsers/${uid}`), {
    joinedAt: serverTimestamp(),
  });
}

export function setName({
  gameKey,
  uid,
  name,
}: {
  gameKey: GameKey;
  uid: string;
  name: string;
}) {
  const { database } = getFirebase();
  set(ref(database, `games/${gameKey}/liveUsers/${uid}/name`), name);
}

export function pickUpPiece({
  gameKey,
  pieceKey,
  uid,
}: {
  gameKey: GameKey;
  pieceKey: PieceKey;
  uid: Uid;
}) {
  const { database } = getFirebase();
  return runTransaction(
    ref(database, `games/${gameKey}/jigsaw/${pieceKey}/heldBy`),
    (currentData?: Uid) => {
      if (currentData) {
        return;
      }
      return uid;
    },
  );
}

export function releasePiece({
  gameKey,
  pieceKey,
  uid,
}: {
  gameKey: GameKey;
  pieceKey: PieceKey;
  uid: Uid;
}) {
  const { database } = getFirebase();
  // TODO is transaction needed here?
  return runTransaction(
    ref(database, `games/${gameKey}/jigsaw/${pieceKey}/heldBy`),
    (currentData?: Uid) => {
      if (currentData !== uid) {
        return;
      }
      return null;
    },
  );
}

export function setPiecePos({
  gameKey,
  pieceKey,
  top,
  left,
}: {
  gameKey: GameKey;
  pieceKey: PieceKey;
  top: number;
  left: number;
}) {
  const { database } = getFirebase();
  update(ref(database), {
    [`games/${gameKey}/jigsaw/${pieceKey}/top`]: top,
    [`games/${gameKey}/jigsaw/${pieceKey}/left`]: left,
  });
}

export function rotatePiece({
  gameKey,
  pieceKey,
  direction,
}: {
  gameKey: GameKey;
  pieceKey: PieceKey;
  direction: 'clockwise' | 'anticlockwise';
}) {
  const { database } = getFirebase();
  return runTransaction(
    ref(database, `games/${gameKey}/jigsaw/${pieceKey}/rotation`),
    (prev: number) => {
      return direction === 'clockwise'
        ? prev + PIECE_ROTATION_AMOUNT
        : prev - PIECE_ROTATION_AMOUNT;
    },
  );
}

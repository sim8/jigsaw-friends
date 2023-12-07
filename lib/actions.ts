import { UserCredential, signInAnonymously } from 'firebase/auth';
import {
  ref,
  child,
  push,
  get,
  set,
  update,
  remove,
  runTransaction,
  serverTimestamp,
} from 'firebase/database';
import { getFirebase } from '../firebase/clientApp';
import {
  Game,
  GameKey,
  JigsawSettings,
  PieceKey,
  PieceState,
  Uid,
} from '../types';
import { generateJigsawState } from './jigsawGeneration';
import { JIGSAW_CONFIG } from '../constants/jigsawConfig';
import { PIECE_ROTATION_AMOUNT } from '../constants/uiConfig';
import {
  getColumnsRowsFromKey,
  getKeyFromColumnsRows,
} from '../utils/settings';
import { NUMBER_OF_PIECES_OPTIONS } from '../constants/numberOfPiecesOptions';
import { BUILT_IN_JIGSAW_IMAGES } from '../constants/builtInJigsawImages';

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
    settings: {
      // default to smallest number of pieces
      columnsRowsKey: getKeyFromColumnsRows(NUMBER_OF_PIECES_OPTIONS[0]),
      // random built in puzzle
      url: BUILT_IN_JIGSAW_IMAGES[
        Math.floor(Math.random() * BUILT_IN_JIGSAW_IMAGES.length)
      ].filename,
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

export async function startGame({ gameKey }: { gameKey: GameKey }) {
  const { database } = getFirebase();

  const dataSnapshot = await get(ref(database, `games/${gameKey}/settings`));
  const jigsawSettings = dataSnapshot.val() as JigsawSettings;

  const [columns, rows] = getColumnsRowsFromKey(jigsawSettings.columnsRowsKey);

  update(ref(database), {
    [`games/${gameKey}/startedAt`]: serverTimestamp(),
    [`games/${gameKey}/jigsaw`]: generateJigsawState({
      ...JIGSAW_CONFIG,
      columns,
      rows,
    }),
  });
}

export function setJigsawUrl({
  gameKey,
  url,
}: {
  gameKey: GameKey;
  url: JigsawSettings['url'];
}) {
  const { database } = getFirebase();
  set(ref(database, `games/${gameKey}/settings/url`), url);
}

export function setJigsawColumnsRows({
  gameKey,
  columnsRowsKey,
}: {
  gameKey: GameKey;
  columnsRowsKey: JigsawSettings['columnsRowsKey'];
}) {
  const { database } = getFirebase();
  set(
    ref(database, `games/${gameKey}/settings/columnsRowsKey`),
    columnsRowsKey,
  );
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
        // TODO maybe log an error here? This should never happen
        return;
      }
      return null;
    },
  );
}

export async function joinPiece({
  gameKey,
  heldPieceKey,
  joiningPieceKey,
}: {
  gameKey: GameKey;
  heldPieceKey: PieceKey;
  joiningPieceKey: PieceKey;
}) {
  const { database } = getFirebase();

  const dataSnapshot = await get(
    ref(database, `games/${gameKey}/jigsaw/${heldPieceKey}/childPieces`),
  );
  const heldChildPieces = dataSnapshot.val() as PieceState['childPieces'];

  const transactionResult = await runTransaction(
    ref(database, `games/${gameKey}/jigsaw/${joiningPieceKey}`),
    (currentData: PieceState): PieceState | undefined => {
      if (currentData.heldBy) {
        // avoid weirdness by not allowing joining two held pieces
        return;
      }
      return {
        ...currentData,
        childPieces: {
          ...currentData.childPieces,
          ...(heldChildPieces || {}),
          [heldPieceKey]: true,
        },
      };
    },
  );

  if (transactionResult.committed) {
    remove(ref(database, `games/${gameKey}/jigsaw/${heldPieceKey}`));
  }

  return transactionResult;
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

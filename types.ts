export type Piece = {
  colIndex: number;
  rowIndex: number;
};

export type PieceKey = string;
export type Uid = string;

export type PieceState = {
  top: number;
  left: number;
  rotation: number;
  heldBy?: Uid;
  childPieces?: Record<PieceKey, true>;
  lastDragged?: number;
};

export type JigsawState = Record<PieceKey, PieceState>;

export type DragPieceInfo = {
  draggingPieceKey: PieceKey;
  initialPieceMouseOffsetX: number;
  initialPieceMouseOffsetY: number;
};

export type User = {
  uid: Uid;
  displayName: string | null;
};

export type GameKey = string;

// Null / empty objects are not stored in Firebase
export type UserState = {
  joinedAt: number;
  cursorPos?: {
    top: number;
    left: number;
  };
  name?: string;
};

// Null / empty objects are not stored in Firebase
export type Game = {
  host: Uid;
  startedAt?: number;
  liveUsers: Record<string, UserState>;
  jigsaw?: JigsawState;
  settings: JigsawSettings;
};

export type GameContextType = Game & {
  gameKey: GameKey;
  rows: number;
  columns: number;
  jigsawWidth: number;
  jigsawHeight: number;
};

export type Vector = [number, number];

export type Coordinates = [number, number];

export type BuiltInJigsawImage = {
  creditHtml: string;
  filename: string;
};

export type ColumnsRows = [number, number];

export type JigsawSettings = {
  columnsRowsKey: string;
  url: string;
};

export type SvgCommand =
  | ['M', Coordinates]
  | ['Q', Coordinates, Coordinates]
  | ['T', Coordinates]
  | ['L', Coordinates];

export type SvgPath = SvgCommand[];

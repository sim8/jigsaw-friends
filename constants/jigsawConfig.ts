import { JigsawConfig } from '../types';

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
const JIGSAW_WIDTH = 400;
const JIGSAW_HEIGHT = 300;
const COLUMNS = 3;
const ROWS = 1;

export const JIGSAW_CONFIG: JigsawConfig = Object.freeze({
  canvasWidth: CANVAS_WIDTH,
  canvasHeight: CANVAS_HEIGHT,
  jigsawWidth: JIGSAW_WIDTH,
  jigsawHeight: JIGSAW_HEIGHT,
  columns: COLUMNS,
  rows: ROWS,
});

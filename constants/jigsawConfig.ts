import { JigsawConfig } from '../types';

export const CANVAS_WIDTH_V2 = 10000;
export const CANVAS_HEIGHT_V2 = 6180;

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
const JIGSAW_WIDTH = 400;
const JIGSAW_HEIGHT = 300;

export const JIGSAW_CONFIG: JigsawConfig = Object.freeze({
  canvasWidth: CANVAS_WIDTH,
  canvasHeight: CANVAS_HEIGHT,
  jigsawWidth: JIGSAW_WIDTH,
  jigsawHeight: JIGSAW_HEIGHT,
});

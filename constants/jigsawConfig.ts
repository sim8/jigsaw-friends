import { JigsawConfig } from '../types';

export const CANVAS_WIDTH_V2 = 10000;
export const CANVAS_HEIGHT_V2 = 6180;
export const MAX_HEIGHT_OR_WIDTH_PERCENTAGE_OF_CANVAS = 0.8;

const JIGSAW_WIDTH = 400;
const JIGSAW_HEIGHT = 300;

export const JIGSAW_CONFIG: JigsawConfig = Object.freeze({
  jigsawWidth: JIGSAW_WIDTH,
  jigsawHeight: JIGSAW_HEIGHT,
});

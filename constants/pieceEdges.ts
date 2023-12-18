import { SvgPath } from '../types';

/**
 * All piece edges follow these rules:
 *
 * - implied starting pos of 0,0
 * - finish on 100,0
 * - should never exceed box of which diagonal is 0,0 -> 100,0
 */

export const FLAT_EDGE: SvgPath = [['L', [100, 0]]];

const REGULAR_TAB_EDGE: SvgPath = [
  ['Q', [30, 10], [37, 7]],
  ['T', [40, -5]],
  ['Q', [38, -7], [45, -10]],
  ['T', [48, -5]],
  ['T', [50, 5]],
  ['T', [100, 0]],
];

export const NON_FLAT_EDGES = [REGULAR_TAB_EDGE];

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
  ['Q', [40, 10], [45, 20]],
  ['Q', [50, 30], [60, 30]],
  ['Q', [70, -10], [100, 0]],
];

export const NON_FLAT_EDGES = [REGULAR_TAB_EDGE];

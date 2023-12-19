import { FLAT_EDGE, NON_FLAT_EDGES } from '../constants/pieceEdges';
import { Coordinates } from '../types';
import {
  flipVertically,
  rotateClockwise,
  scaleForBoundingBox,
  translate,
} from './coordinatesTransforms';
import { mulberry32 } from './misc';

function getSeededRandomEdgePath(seed: number) {
  const rand = mulberry32(seed);
  return {
    edgePath: NON_FLAT_EDGES[Math.floor(rand * NON_FLAT_EDGES.length)],
    flipped: rand > 0.5,
  };
}

function renderCoordinatesWithTransforms({
  coordinates,
  rotation,
  flipped,
  drawAntiClockwise,
}: {
  coordinates: Coordinates;
  rotation: number;
  flipped: boolean;
  drawAntiClockwise?: boolean;
}) {
  const maybeFlipped = flipped ? flipVertically(coordinates) : coordinates;
  const maybeTranslated = drawAntiClockwise
    ? translate(maybeFlipped, [0, 100])
    : maybeFlipped;
  const rotated = rotateClockwise(
    maybeTranslated,
    drawAntiClockwise ? (rotation + 2) % 4 : rotation,
  );
  return scaleForBoundingBox(rotated).join(',');
}

function getEdgePath({
  edgeIndex,
  totalEdges,
  seed,
  rotation,
  drawAntiClockwise,
}: {
  edgeIndex: number;
  totalEdges: number;
  seed: number;
  rotation: number;
  drawAntiClockwise?: boolean;
}) {
  const isJigsawEdge = edgeIndex === 0 || edgeIndex + 1 === totalEdges;
  const { edgePath, flipped } = isJigsawEdge
    ? { edgePath: FLAT_EDGE, flipped: false }
    : getSeededRandomEdgePath(
        /**
         * Ensure a unique seed for each piece edge.
         *
         * - Use the rotation remainder as neighbouring edges
         *   may have rotations of e.g. 2 + 4.
         * - Multiply rotation to avoid seed clashes with
         *   edgeIndexes (avoid visible patterns)
         */
        seed + edgeIndex + (rotation % 2) * 10000,
      );

  return edgePath
    .map(
      ([command, ...params]) =>
        `${command} ${params
          .map((coordinates) =>
            renderCoordinatesWithTransforms({
              coordinates,
              rotation,
              drawAntiClockwise,
              flipped,
            }),
          )
          .join(' ')}`,
    )
    .join(' ');
}

export function getPiecePath({
  columns,
  rows,
  colIndex,
  rowIndex,
  seed,
}: {
  columns: number;
  rows: number;
  colIndex: number;
  rowIndex: number;
  seed: number;
}) {
  /**
   * Odd pieces are drawn anti-clockwise - this allows the same
   * edge paths to be used for neighbouring pieces
   */
  const isOdd = (colIndex + rowIndex) % 2 === 1;

  const edges = [
    {
      // top
      edgeIndex: rowIndex,
      totalEdges: rows + 1,
      rotation: 0,
    },
    {
      // right
      edgeIndex: colIndex + 1,
      totalEdges: columns + 1,
      rotation: 1,
    },
    {
      // bottom
      edgeIndex: rowIndex + 1,
      totalEdges: rows + 1,
      rotation: 2,
    },
    {
      // left
      edgeIndex: colIndex,
      totalEdges: columns + 1,
      rotation: 3,
    },
  ];

  if (isOdd) {
    edges.reverse();
  }
  return `
    M ${scaleForBoundingBox([0, 0]).join(',')}
    ${edges
      .map((edge) => getEdgePath({ ...edge, seed, drawAntiClockwise: isOdd }))
      .join('\n')}
  `;
}

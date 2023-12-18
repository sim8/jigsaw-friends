import { FLAT_EDGE, NON_FLAT_EDGES } from '../constants/pieceEdges';
import { Coordinates, Vector } from '../types';
import {
  rotateClockwise,
  scaleForBoundingBox,
  translate,
} from './coordinatesTransforms';

type EdgePathParams = {
  edgeIndex: number;
  totalEdges: number;
  seed: number;
  rotation: number;
  drawAntiClockwise?: boolean;
};

function getSeededRandomEdgePath(seed: number) {
  // TODO return seeded random item from array
  // mulberry32?
  return NON_FLAT_EDGES[0];
}

function getEdgePath({
  edgeIndex,
  totalEdges,
  seed,
  rotation,
  drawAntiClockwise,
}: EdgePathParams) {
  const isJigsawEdge = edgeIndex === 0 || edgeIndex + 1 === totalEdges;
  const edgePath = isJigsawEdge
    ? FLAT_EDGE
    : getSeededRandomEdgePath(seed + edgeIndex + rotation);

  const renderCoordinatesWithTransforms = (coordinates: Coordinates) => {
    const maybeTranslated = drawAntiClockwise
      ? translate(coordinates, [0, 100])
      : coordinates;
    const rotated = rotateClockwise(
      maybeTranslated,
      drawAntiClockwise ? (rotation + 2) % 4 : rotation,
    );
    return scaleForBoundingBox(rotated).join(',');
  };

  return edgePath
    .map(
      ([command, ...params]) =>
        `${command} ${params.map(renderCoordinatesWithTransforms).join(' ')}`,
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

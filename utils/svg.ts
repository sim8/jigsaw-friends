import { FLAT_EDGE, NON_FLAT_EDGES } from '../constants/pieceEdges';
import { Coordinates } from '../types';
import { rotateClockwise, scaleForBoundingBox } from './coordinatesTransforms';

function getSeededRandomEdgePath(seed: number) {
  // TODO return seeded random item from array
  return NON_FLAT_EDGES[0];
}

function getEdgePath({
  edgeIndex,
  totalEdges,
  seed,
  rotation,
}: {
  edgeIndex: number;
  totalEdges: number;
  seed: number;
  rotation: number;
}) {
  const isJigsawEdge = edgeIndex === 0 || edgeIndex + 1 === totalEdges;
  const edgePath = isJigsawEdge
    ? FLAT_EDGE
    : getSeededRandomEdgePath(seed + edgeIndex + rotation);

  const renderCoordinatesWithTransforms = (coordinates: Coordinates) =>
    scaleForBoundingBox(rotateClockwise(coordinates, rotation)).join(',');

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
  return `
   M ${scaleForBoundingBox([0, 0]).join(',')}
   ${getEdgePath({
     // top
     edgeIndex: rowIndex,
     totalEdges: rows + 1,
     seed,
     rotation: 0,
   })}
   ${getEdgePath({
     // right
     edgeIndex: colIndex + 1,
     totalEdges: columns + 1,
     seed,
     rotation: 1,
   })}
  ${getEdgePath({
    // bottom
    edgeIndex: rowIndex + 1,
    totalEdges: rows + 1,
    seed,
    rotation: 2,
  })}
  ${getEdgePath({
    // left
    edgeIndex: colIndex,
    totalEdges: columns + 1,
    seed,
    rotation: 3,
  })}
   L ${scaleForBoundingBox([0, 0]).join(',')}
  `;
}

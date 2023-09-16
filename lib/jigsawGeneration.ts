import { Piece } from '../types'

export function generatePieces({
  jigsawWidth, jigsawHeight, rows, columns
}: {jigsawWidth: number, jigsawHeight: number, rows: number, columns: number}): Piece[] {
  return [...Array(rows)].flatMap((_, rowIndex) => {
    return [...Array(columns)].flatMap((_, columnIndex) => {
      const pieceWidth = jigsawWidth / columns
      const pieceHeight = jigsawHeight / rows
      const piece: Piece = {
        width: pieceWidth,
        height: pieceHeight,
        imageOffsetX: pieceWidth * columnIndex,
        imageOffsetY: pieceWidth * rowIndex
      }
      return piece
    })
  });
}

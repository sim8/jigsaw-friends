import styled from 'styled-components'
import { generatePieces } from '../lib/jigsawGeneration'
import { useMemo } from 'react';
import Image from 'next/image'

const CanvasWrapper = styled.div`
  border: 7px solid #0099ff;
  height: 600px;
  width: 800px;
`



export default function JigsawCanvas() {
  const pieces = useMemo(() => generatePieces({jigsawWidth: 3240, jigsawHeight: 2430, rows: 2, columns: 2}), [])
  return <CanvasWrapper>
    {pieces.map(({width, height, imageOffsetX, imageOffsetY}, i) => <div key={i} style={{
      outline: '2px solid green',
      backgroundImage: 'url("images/test-image-1.jpg")',
      backgroundPositionX: imageOffsetX,
      backgroundPositionY: imageOffsetY,
      width,
      height,
}}/>)}
  </CanvasWrapper>;
}

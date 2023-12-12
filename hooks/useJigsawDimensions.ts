import { useMemo } from 'react';
import {
  CANVAS_HEIGHT_V2,
  CANVAS_WIDTH_V2,
  MAX_HEIGHT_OR_WIDTH_PERCENTAGE_OF_CANVAS,
} from '../constants/jigsawConfig';
import { JigsawSettings } from '../types';
import useImageDimensions from './useImageDimensions';

export default function useJigsawDimensions(url: JigsawSettings['url'] | null) {
  const { width: imageWidth, height: imageHeight } = useImageDimensions(url);

  return useMemo(() => {
    if (!imageWidth || !imageHeight) {
      return { width: 0, height: 0 };
    }
    const widthOfCanvasPercentage = imageWidth / CANVAS_WIDTH_V2;
    const heightOfCanvasPercentage = imageHeight / CANVAS_HEIGHT_V2;

    // TODO this can def be simplified
    if (widthOfCanvasPercentage > heightOfCanvasPercentage) {
      const inverseAspectRatio = imageHeight / imageWidth;
      const width = CANVAS_WIDTH_V2 * MAX_HEIGHT_OR_WIDTH_PERCENTAGE_OF_CANVAS;
      return {
        width,
        height: width * inverseAspectRatio,
      };
    } else {
      const aspectRatio = imageWidth / imageHeight;
      const height =
        CANVAS_HEIGHT_V2 * MAX_HEIGHT_OR_WIDTH_PERCENTAGE_OF_CANVAS;
      return {
        width: height * aspectRatio,
        height: height,
      };
    }
  }, [imageWidth, imageHeight]);
}

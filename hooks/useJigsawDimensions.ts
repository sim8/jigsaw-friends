import { useMemo } from 'react';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  MAX_HEIGHT_OR_WIDTH_PERCENTAGE_OF_CANVAS,
} from '../constants/uiConfig';
import { JigsawSettings } from '../types';
import useImageDimensions from './useImageDimensions';

export default function useJigsawDimensions(url: JigsawSettings['url'] | null) {
  const { width: imageWidth, height: imageHeight } = useImageDimensions(url);

  return useMemo(() => {
    if (!imageWidth || !imageHeight) {
      return { width: 0, height: 0 };
    }
    const widthOfCanvasPercentage = imageWidth / CANVAS_WIDTH;
    const heightOfCanvasPercentage = imageHeight / CANVAS_HEIGHT;

    // TODO this can def be simplified
    if (widthOfCanvasPercentage > heightOfCanvasPercentage) {
      const inverseAspectRatio = imageHeight / imageWidth;
      const width = CANVAS_WIDTH * MAX_HEIGHT_OR_WIDTH_PERCENTAGE_OF_CANVAS;
      return {
        width,
        height: width * inverseAspectRatio,
      };
    } else {
      const aspectRatio = imageWidth / imageHeight;
      const height = CANVAS_HEIGHT * MAX_HEIGHT_OR_WIDTH_PERCENTAGE_OF_CANVAS;
      return {
        width: height * aspectRatio,
        height: height,
      };
    }
  }, [imageWidth, imageHeight]);
}

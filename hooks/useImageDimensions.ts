import { useEffect, useState } from 'react';
import { JigsawSettings } from '../types';
import { getBuiltInImagePath } from '../utils/urls';

export default function useImageDimensions(url: JigsawSettings['url'] | null) {
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!url) {
      return;
    }

    const img = new Image();

    img.onload = function () {
      const { width, height } = img;
      setImageDimensions({ width, height });
    };

    img.src = getBuiltInImagePath(url);
  }, [url]);

  return imageDimensions;
}

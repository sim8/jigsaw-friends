import styled from 'styled-components';
import { JigsawSettings } from '../types';
import Modal, { ModalProps } from './styled/Modal';
import { BUILT_IN_JIGSAW_IMAGES } from '../constants/builtInJigsawImages';
import { getBuiltInImagePath } from '../utils/urls';
import Button from './styled/Button';
import { useMemo, useState } from 'react';

type Props = Omit<ModalProps, 'children'> & {
  onSelect: (url: JigsawSettings['url']) => void;
  prevUrl: JigsawSettings['url'];
};

const GridAndPreview = styled.div`
  display: flex;
`;

const ImagePreview = styled.div`
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    overflow: hidden;
  }
`;

const ImagePreviewAndCredit = styled.div`
  text-align: center;
`;

const ImageGrid = styled.div``;

const Footer = styled.div`
  text-align: center;
  padding: 10px 0;
`;

const Header = styled.div`
  text-align: center;
  padding: 10px 0;
`;

const ImageGridItem = styled.div`
  width: 230px;
  height: 140px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    overflow: hidden;
  }
`;

export default function JigsawImageSelectionModal({
  prevUrl,
  onSelect,
  ...modalProps
}: Props) {
  const [selectedImage, setSelectedImage] = useState(prevUrl);

  const creditHtml = useMemo(() => {
    const image = BUILT_IN_JIGSAW_IMAGES.find(
      ({ filename }) => filename === selectedImage,
    );
    if (!image) {
      throw new Error('Image not found');
    }
    return image.creditHtml;
  }, [selectedImage]);

  return (
    <Modal {...modalProps}>
      <Header>
        <Button>Choose</Button>
      </Header>
      <GridAndPreview>
        <ImageGrid>
          {BUILT_IN_JIGSAW_IMAGES.map(({ filename }) => (
            <ImageGridItem
              key={filename}
              onClick={() => setSelectedImage(filename)}
            >
              <img src={getBuiltInImagePath(filename)} alt="Jigsaw preview" />
            </ImageGridItem>
          ))}
        </ImageGrid>
        <ImagePreviewAndCredit>
          <ImagePreview>
            <img
              src={getBuiltInImagePath(selectedImage)}
              alt="Jigsaw preview"
            />
          </ImagePreview>
          <p dangerouslySetInnerHTML={{ __html: creditHtml }} />
        </ImagePreviewAndCredit>
      </GridAndPreview>
      <Footer>
        <Button
          onClick={() => {
            onSelect(selectedImage);
            modalProps.onClose();
          }}
        >
          Select
        </Button>
      </Footer>
    </Modal>
  );
}

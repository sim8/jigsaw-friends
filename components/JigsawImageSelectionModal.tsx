import styled from 'styled-components';
import { JigsawSettings } from '../types';
import Modal, { ModalProps } from './styled/Modal';
import { BUILT_IN_JIGSAW_IMAGES } from '../constants/builtInJigsawImages';
import { getBuiltInImagePath } from '../utils/urls';
import Button from './styled/Button';
import { useMemo, useState } from 'react';
import Image from 'next/image';

type Props = Omit<ModalProps, 'children'> & {
  onSelect: (url: JigsawSettings['url']) => void;
  prevUrl: JigsawSettings['url'];
};

const ModalContents = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  align-items: stretch;
  justify-content: space-between;
`;

const GridAndPreview = styled.div`
  display: flex;
  flex-grow: 1;
  overflow-y: scroll;
`;

const ImagePreview = styled.div`
  height: 100%;
  position: relative;
`;

const ImagePreviewAndCredit = styled.div`
  text-align: center;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ImageGrid = styled.div`
  overflow: scroll;
`;

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
  position: relative;
`;

export default function JigsawImageSelectionModal({
  prevUrl,
  onSelect,
  ...modalProps
}: Props) {
  const [selectedImage, setSelectedImage] = useState(prevUrl);

  const selectedBuiltInImage = useMemo(() => {
    const image = BUILT_IN_JIGSAW_IMAGES.find(
      ({ filename }) => filename === selectedImage,
    );
    if (!image) {
      throw new Error('Image not found');
    }
    return image;
  }, [selectedImage]);

  return (
    <Modal {...modalProps}>
      <ModalContents>
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
                <Image
                  src={getBuiltInImagePath(filename)}
                  alt="Jigsaw preview"
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </ImageGridItem>
            ))}
          </ImageGrid>
          <ImagePreviewAndCredit>
            <ImagePreview>
              <Image
                src={getBuiltInImagePath(selectedBuiltInImage.filename)}
                fill
                style={{
                  objectFit: 'contain',
                }}
                alt="Jigsaw preview"
              />
            </ImagePreview>
            <p
              dangerouslySetInnerHTML={{
                __html: selectedBuiltInImage.creditHtml,
              }}
            />
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
      </ModalContents>
    </Modal>
  );
}

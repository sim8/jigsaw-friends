import { JigsawSettings } from '../types';
import Modal, { ModalProps } from './styled/Modal';

type Props = Omit<ModalProps, 'children'> & {
  onSelect: (url: JigsawSettings['url']) => void;
};

export default function JigsawImageSelectionModal({ ...modalProps }: Props) {
  return <Modal {...modalProps}>{'Hi there'}</Modal>;
}

import styled from 'styled-components';
import { UnstyledButton } from './Button';

type Props = {
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
};

const ModalWrapper = styled.div`
  border: 4px solid black;
  width: calc(100% - 100px);
  aspect-ratio: 1.618 / 1;
  position: relative;
  background-color: white;
`;

const ScreenCover = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(5px);
`;

const CloseButton = styled(UnstyledButton)`
  position: absolute;
  right: 0;
  top: 0;
  padding: 15px;
`;

export default function Modal({ children, onClose }: Props) {
  return (
    <ScreenCover>
      <ModalWrapper>
        <CloseButton onClick={onClose}>X</CloseButton>
        {children}
      </ModalWrapper>
    </ScreenCover>
  );
}

export type ModalProps = Props;

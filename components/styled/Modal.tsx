import styled from 'styled-components';
import { UnstyledButton } from './Button';

type Props = {
  width?: number;
  onClose: () => void;
  children: React.ReactNode;
};

const ModalWrapper = styled.div<{ width: number }>`
  border: 4px solid black;
  width: ${({ width }) => width}px;
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

export default function Modal({ width = 600, children, onClose }: Props) {
  return (
    <ScreenCover>
      <ModalWrapper width={width}>
        {children}
        <CloseButton onClick={onClose}>X</CloseButton>
      </ModalWrapper>
    </ScreenCover>
  );
}

export type ModalProps = Props;

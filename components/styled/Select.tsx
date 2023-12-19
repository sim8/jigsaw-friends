import styled from 'styled-components';
import { pangolin } from '../../utils/fonts';

type Props = React.InputHTMLAttributes<HTMLSelectElement> & {
  // size?: 'large' | 'medium';
};

const StyledSelect = styled.select`
  // resets
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  font-family: ${pangolin.style.fontFamily};
  border: 3px solid black;
  border-radius: 10px;
  padding: 10px 25px 10px 10px;
  background-color: white;
  position: relative;
`;

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const Arrow = styled.span`
  position: absolute;
  user-select: none;
  right: 11px;
  top: 11px;
  pointer-events: none;
  transform: scale(1.2, 0.7);
`;

export default function Select({ ...selectProps }: Props) {
  return (
    <Container>
      <StyledSelect {...selectProps} />
      <Arrow>v</Arrow>
    </Container>
  );
}

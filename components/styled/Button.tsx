import styled from 'styled-components';
import { pangolin } from '../../utils/fonts';
import { COLORS } from '../../constants/colors';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'large' | 'medium';
};

const getFontSize = (props: Props) => {
  switch (props.size) {
    case 'large':
      return '64px';
    default: // medium
      return '24px';
  }
};

const StyledButton = styled.button`
  // resets
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;

  font-family: ${pangolin.style.fontFamily};
  border: 4px solid ${(props) => (props.disabled ? COLORS.GRAY : 'black')};
  border-radius: 6px;
  padding: 10px 20px;

  font-size: ${getFontSize};

  ${(props) =>
    props.disabled &&
    `
    color: ${COLORS.GRAY};
    cursor: not-allowed;
  `};
`;

export default function Button({ ...buttonProps }: Props) {
  return <StyledButton {...buttonProps} />;
}

import styled from 'styled-components';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  // size?: 'large' | 'medium';
};

const StyledInput = styled.input`
  // resets
  all: unset;

  width: 100%;
  box-sizing: border-box;
  border: 3px solid black;
  border-radius: 10px;
  padding: 10px;
  background-color: white;
`;

export default function Input({ ...inputProps }: Props) {
  return <StyledInput {...inputProps} />;
}

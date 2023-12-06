import styled from 'styled-components';

type Props = {
  title: string;
  children: React.ReactNode;
  formName?: string;
};

const FormControlWrapper = styled.div`
  label {
    display: block;
  }
`;

export default function FormControl({ title, formName, children }: Props) {
  return (
    <FormControlWrapper>
      <label htmlFor={formName}>{title}</label>
      {children}
    </FormControlWrapper>
  );
}

import styled from 'styled-components';
import useDebug from '../hooks/useDebug';
import { COLORS } from '../constants/colors';
import Button from './styled/Button';

const ControlsWrapper = styled.div`
  position: fixed;
  bottom: 10px;
  left: 10px;
  background-color: ${COLORS.ELECTRIC_BLUE};
  color: white;
  padding: 20px;
`;

export default function DebugControls() {
  const { isDev, debugEnabled, setDebugEnabled } = useDebug();
  if (!isDev) {
    return null;
  }
  return (
    <ControlsWrapper>
      <h2>Debug layer</h2>
      <Button onClick={() => setDebugEnabled(!debugEnabled)}>
        {debugEnabled ? 'Disable' : 'Enable'}
      </Button>
    </ControlsWrapper>
  );
}

import styled from 'styled-components';
import { getOverlayPositioningStyles } from '../utils/canvas';
import useLiveUsers from '../hooks/useLiveUsers';

type Props = {
  top: number;
  left: number;
  uid: string;
};

const Cursor = styled.div<{ color: string }>`
  width: 30px;
  height: 30px;
  background-color: ${({ color }) => color};
  position: absolute;
`;

export default function PlayerCursor({ uid, top, left }: Props) {
  const { liveUsersWithColors } = useLiveUsers();

  if (!liveUsersWithColors[uid]) {
    return null;
  }

  return (
    <Cursor
      color={liveUsersWithColors[uid].color}
      style={{
        ...getOverlayPositioningStyles({ top, left }),
      }}
    />
  );
}

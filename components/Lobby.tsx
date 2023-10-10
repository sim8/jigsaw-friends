import { useCallback, useMemo } from 'react';
import useGame from '../hooks/useGame';
import { setName, startGame } from '../lib/actions';
import { getGameLink } from '../utils/urls';
import useUser from '../hooks/useUser';
import { Title } from './sharedstyles';
import Button from './styled/Button';
import styled from 'styled-components';
import Input from './styled/Input';

const PlayerCardList = styled.ol`
  margin: 0;
  padding: 0;
`;

const PlayerCardWrapper = styled.div`
  border: 3px solid black;
  border-radius: 10px;
  padding: 10px;
`;

export default function Lobby() {
  const { gameKey, liveUsers, host } = useGame();
  const { user } = useUser();

  const orderedLiveUserIds = useMemo(
    () =>
      Object.entries(liveUsers)
        .sort(([, a], [, b]) => a.joinedAt - b.joinedAt)
        .map(([uid]) => uid),
    [liveUsers],
  );

  const copyInviteLink = useCallback(() => {
    const link = getGameLink(gameKey, true);
    navigator.clipboard.writeText(link);
  }, [gameKey]);

  return (
    <div>
      <Title>Lobby</Title>
      <PlayerCardList>
        {orderedLiveUserIds.map((uid, index) => (
          <PlayerCardWrapper key={uid}>
            {user && user.uid === uid ? (
              <Input
                type="text"
                autoComplete="off"
                autoFocus={true}
                placeholder="Type your name!"
                value={liveUsers[uid].name || ''}
                onChange={(e) =>
                  setName({ gameKey, uid: user.uid, name: e.target.value })
                }
              />
            ) : (
              liveUsers[uid].name || `Player ${index + 1}`
            )}
          </PlayerCardWrapper>
        ))}
      </PlayerCardList>
      <Button
        onClick={() => startGame({ gameKey })}
        disabled={user ? user.uid !== host : true}
      >
        Start
      </Button>
      <Button onClick={() => copyInviteLink()}>Copy invite link</Button>
    </div>
  );
}

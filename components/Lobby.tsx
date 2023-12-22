import { useCallback } from 'react';
import useGame from '../hooks/useGame';
import { setName, startGame } from '../lib/actions';
import { getGameLink } from '../utils/urls';
import useUser from '../hooks/useUser';
import { Title } from './sharedstyles';
import Button from './styled/Button';
import styled from 'styled-components';
import Input from './styled/Input';
import JigsawSettings from './JigsawSettings';
import useLiveUsers from '../hooks/useLiveUsers';

const LobbyContents = styled.div`
  display: flex;
  margin: 40px 0;
  gap: 20px;
`;

const PlayerCardList = styled.ol`
  margin: 0;
  padding: 30px 0 0;
  width: 400px;
`;

const PlayerCardWrapper = styled.div`
  border: 4px solid black;
  border-radius: 10px;
  padding: 10px;
  background-color: ${(props) => props.color};
  margin-bottom: 5px;
`;

export default function Lobby() {
  const { gameKey, host, jigsawWidth, jigsawHeight } = useGame();
  const { orderedLiveUserIds, liveUsersWithColors } = useLiveUsers();

  const { user } = useUser();

  const copyInviteLink = useCallback(() => {
    const link = getGameLink(gameKey, true);
    navigator.clipboard.writeText(link);
  }, [gameKey]);

  return (
    <div>
      <Title>Lobby</Title>
      <LobbyContents>
        <div>
          <PlayerCardList>
            {orderedLiveUserIds.map((uid, index) => (
              <PlayerCardWrapper
                key={uid}
                color={liveUsersWithColors[uid].color}
              >
                {user && user.uid === uid ? (
                  <Input
                    type="text"
                    maxLength={50}
                    autoFocus={true}
                    placeholder="Type your name!"
                    value={liveUsersWithColors[uid].name || ''}
                    onChange={(e) =>
                      setName({ gameKey, uid: user.uid, name: e.target.value })
                    }
                  />
                ) : (
                  liveUsersWithColors[uid].name || `Player ${index + 1}`
                )}
              </PlayerCardWrapper>
            ))}
          </PlayerCardList>
          <Button onClick={() => copyInviteLink()}>Copy invite link</Button>
        </div>
        <JigsawSettings />
      </LobbyContents>
      <Button
        onClick={() => startGame({ gameKey, jigsawWidth, jigsawHeight })}
        disabled={user ? user.uid !== host : true}
        size="large"
        style={{ display: 'block', margin: '0 auto' }}
      >
        Start
      </Button>
    </div>
  );
}

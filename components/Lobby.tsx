import { useCallback, useMemo, useState } from 'react';
import useGame from '../hooks/useGame';
import { setName, startGame } from '../lib/actions';
import { getGameLink, getImagePath } from '../utils/urls';
import useUser from '../hooks/useUser';
import { Title } from './sharedstyles';
import Button from './styled/Button';
import styled from 'styled-components';
import Input from './styled/Input';
import { COLOR_OPTIONS } from '../constants/colors';
import JigsawSettingsCard from './JigsawSettingsCard';
import { JigsawSettings } from '../types';
import { getKeyFromColumnsRows } from '../utils/settings';
import { NUMBER_OF_PIECES_OPTIONS } from '../constants/numberOfPiecesOptions';
import { JIGSAW_IMAGES } from '../constants/jigsawImages';

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
  border: 3px solid black;
  border-radius: 10px;
  padding: 10px;
  background-color: ${(props) => props.color};
  margin-bottom: 5px;
`;

export default function Lobby() {
  const { gameKey, liveUsers, host } = useGame();
  const { user } = useUser();

  // TODO - this should live on DB straight away
  // ensure only host can change
  const [jigsawSettings, setJigsawSettings] = useState<JigsawSettings>({
    columnsRowsKey: getKeyFromColumnsRows(NUMBER_OF_PIECES_OPTIONS[0]),
    url: getImagePath(
      JIGSAW_IMAGES[Math.floor(Math.random() * JIGSAW_IMAGES.length)].filename,
    ),
  });

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
      <LobbyContents>
        <div>
          <PlayerCardList>
            {orderedLiveUserIds.map((uid, index) => (
              <PlayerCardWrapper
                key={uid}
                color={COLOR_OPTIONS[index % COLOR_OPTIONS.length]}
              >
                {user && user.uid === uid ? (
                  <Input
                    type="text"
                    maxLength={50}
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
          <Button onClick={() => copyInviteLink()}>Copy invite link</Button>
        </div>
        <JigsawSettingsCard
          jigsawSettings={jigsawSettings}
          setJigsawSettings={setJigsawSettings}
        />
      </LobbyContents>
      <Button
        onClick={() => startGame({ gameKey })}
        disabled={user ? user.uid !== host : true}
        size="large"
        style={{ display: 'block', margin: '0 auto' }}
      >
        Start
      </Button>
    </div>
  );
}

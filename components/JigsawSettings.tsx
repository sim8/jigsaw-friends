import styled from 'styled-components';
import { NUMBER_OF_PIECES_OPTIONS } from '../constants/numberOfPiecesOptions';
import { getKeyFromColumnsRows } from '../utils/settings';
import { useState } from 'react';
import FormControl from './FormControl';
import Image from 'next/image';
import { StyledButton } from './styled/Button';
import Select from './styled/Select';
import JigsawImageSelectionModal from './JigsawImageSelectionModal';
import { getBuiltInImagePath } from '../utils/urls';
import { setJigsawColumnsRows, setJigsawUrl } from '../lib/actions';
import useGame from '../hooks/useGame';

const JigsawSettingsWrapper = styled.div``;

const ImagePreview = styled.div`
  border: 4px solid black;
  border-radius: 10px;
  width: 300px;
  position: relative;
  box-sizing: content-box;
  overflow: hidden;
  font-size: 0;
`;

const ImagePreviewButton = styled(StyledButton)`
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: white;
  border-right: 0;
  border-bottom: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 0;
`;

export default function JigsawSettings() {
  const [modalOpen, setModalOpen] = useState(false);
  const {
    gameKey,
    settings: { url, columnsRowsKey },
  } = useGame();
  return (
    <JigsawSettingsWrapper>
      {/* <h2 style={{ marginTop: 0 }}>Settings</h2> */}
      <FormControl title="Jigsaw">
        <ImagePreview>
          <Image
            src={getBuiltInImagePath(url)}
            alt="Jigsaw preview"
            width={300}
            height={185}
          />
          <ImagePreviewButton size="small" onClick={() => setModalOpen(true)}>
            Change
          </ImagePreviewButton>
        </ImagePreview>
      </FormControl>
      <FormControl title="Pieces" formName="pieces">
        <Select
          name="pieces"
          value={columnsRowsKey}
          onChange={(e) => {
            setJigsawColumnsRows({ gameKey, columnsRowsKey: e.target.value });
          }}
        >
          {NUMBER_OF_PIECES_OPTIONS.map((columnsRows) => {
            const key = getKeyFromColumnsRows(columnsRows);
            const [columns, rows] = columnsRows;
            return (
              <option key={key} value={key}>
                {columns * rows}
              </option>
            );
          })}
        </Select>
      </FormControl>
      {modalOpen && (
        <JigsawImageSelectionModal
          onClose={() => setModalOpen(false)}
          prevUrl={url}
          onSelect={(newUrl) => {
            setJigsawUrl({ gameKey, url: newUrl });
          }}
        />
      )}
    </JigsawSettingsWrapper>
  );
}

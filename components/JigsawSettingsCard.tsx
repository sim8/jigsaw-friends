import styled from 'styled-components';
import { NUMBER_OF_PIECES_OPTIONS } from '../constants/numberOfPiecesOptions';
import { getKeyFromColumnsRows } from '../utils/settings';
import { JigsawSettings } from '../types';
import { Dispatch, SetStateAction, useState } from 'react';
import FormControl from './FormControl';
import Image from 'next/image';
import { StyledButton } from './styled/Button';
import JigsawImageSelectionModal from './JigsawImageSelectionModal';

const JigsawSettingsWrapper = styled.div``;

const ImagePreview = styled.div`
  border: 3px solid black;
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

type Props = {
  jigsawSettings: JigsawSettings;
  setJigsawSettings: Dispatch<SetStateAction<JigsawSettings>>;
};

export default function JigsawSettingsCard({
  jigsawSettings,
  setJigsawSettings,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <JigsawSettingsWrapper>
      {/* <h2 style={{ marginTop: 0 }}>Settings</h2> */}
      <FormControl title="Jigsaw">
        <ImagePreview>
          <Image
            src={jigsawSettings.url}
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
        <select
          name="pieces"
          value={jigsawSettings.columnsRowsKey}
          onChange={(e) =>
            setJigsawSettings((prev) => ({
              ...prev,
              columnsRowsKey: e.target.value,
            }))
          }
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
        </select>
      </FormControl>
      {modalOpen && (
        <JigsawImageSelectionModal
          onClose={() => setModalOpen(false)}
          onSelect={(url) => {
            console.log(url);
          }}
        />
      )}
    </JigsawSettingsWrapper>
  );
}

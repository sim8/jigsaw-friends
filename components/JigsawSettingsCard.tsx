import styled from 'styled-components';
import { NUMBER_OF_PIECES_OPTIONS } from '../constants/numberOfPiecesOptions';
import { getKeyFromColumnsRows } from '../utils/settings';
import { JigsawSettings } from '../types';
import { Dispatch, SetStateAction } from 'react';
import FormControl from './FormControl';

const JigsawSettingsWrapper = styled.div`
  border: 3px solid black;
  border-radius: 10px;
`;

const ImagePreview = styled.img`
  border: 3px solid black;
  border-radius: 10px;
  width: 300px;
`;

type Props = {
  jigsawSettings: JigsawSettings;
  setJigsawSettings: Dispatch<SetStateAction<JigsawSettings>>;
};

export default function JigsawSettingsCard({
  jigsawSettings,
  setJigsawSettings,
}: Props) {
  return (
    <JigsawSettingsWrapper>
      <h2>Settings</h2>
      <FormControl title="Jigsaw">
        <ImagePreview src={jigsawSettings.url} />
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
    </JigsawSettingsWrapper>
  );
}

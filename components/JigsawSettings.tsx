import styled from 'styled-components';
import { NUMBER_OF_PIECES_OPTIONS } from '../constants/numberOfPiecesOptions';
import { getKeyFromColumnsRows } from '../utils/settings';

const JigsawSettingsWrapper = styled.div`
  border: 3px solid black;
  border-radius: 10px;
`;

export default function JigsawSettings() {
  return (
    <JigsawSettingsWrapper>
      <h2>Settings</h2>
      <p>Stuff goes here</p>
      <div>
        <label htmlFor="pieces">Pieces</label>
        <select name="pieces">
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
      </div>
    </JigsawSettingsWrapper>
  );
}

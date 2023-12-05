import { ColumnsRows } from '../types';

export const getKeyFromColumnsRows = (columnsRows: ColumnsRows) => {
  return columnsRows.join(',');
};
export const getColumnsRowsFromKey = (key: string): ColumnsRows => {
  const [columnsStr, rowsStr] = key.split(',');
  return [parseInt(columnsStr, 10), parseInt(rowsStr, 10)];
};

import { useContext } from 'react';
import { DebugContext } from '../contexts/DebugContextProvider';
import { CONTEXT_NOT_PROVIDED } from '../constants/app';

export default function useDebug() {
  const debugContext = useContext(DebugContext);

  if (debugContext === CONTEXT_NOT_PROVIDED) {
    throw new Error('Using DebugContext without it being provided');
  }

  return debugContext;
}

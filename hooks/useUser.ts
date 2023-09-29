import { useContext } from 'react';
import { UserContext } from '../contexts/UserContextProvider';
import { CONTEXT_NOT_PROVIDED } from '../constants/app';

export default function useUser() {
  const userContext = useContext(UserContext);

  if (userContext === CONTEXT_NOT_PROVIDED) {
    throw new Error('Using UserContext without it being provided');
  }

  return userContext;
}

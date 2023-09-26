import { useContext } from 'react';
import { UserContext } from '../contexts/UserContextProvider';

export default function useUser() {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error('Using UserContext without it being provided');
  }

  return userContext;
}

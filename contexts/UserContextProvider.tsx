import { useState, useEffect, createContext } from 'react';
import { getFirebase } from '../firebase/clientApp';
import { onAuthStateChanged } from 'firebase/auth';
import { User } from '../types';
import { CONTEXT_NOT_PROVIDED } from '../constants/app';

export const UserContext = createContext<
  | {
      user: User | null;
      loadingUser: boolean;
    }
  | typeof CONTEXT_NOT_PROVIDED
>(CONTEXT_NOT_PROVIDED);

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const { auth } = getFirebase();
    // Listen authenticated user
    const unsubscriber = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // User is signed in.
          const { uid, displayName } = user;
          // You could also look for the user doc in your Firestore (if you have one):
          // const userDoc = await firebase.firestore().doc(`users/${uid}`).get()
          setUser({ uid, displayName });
        } else setUser(null);
      } catch (error) {
        // TODO - connection error, anything else?
      } finally {
        setLoadingUser(false);
      }
    });

    return () => unsubscriber();
  }, []);

  return (
    <UserContext.Provider value={{ user, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
}

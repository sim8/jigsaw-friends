import { useEffect, useState } from 'react';
import { signIn } from '../lib/actions';

type Props = {
  children: React.ReactNode;
};

export default function RequiresAuth({ children }: Props) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    signIn()
      .then(() => setIsSignedIn(true))
      .catch((e) => setError(e));
  }, []);
  if (error) {
    return 'Sign in error';
  }
  if (!isSignedIn) {
    return 'Loading...';
  }
  return children;
}

import { createContext, useState } from 'react';
import { CONTEXT_NOT_PROVIDED } from '../constants/app';

export const DebugContext = createContext<
  | {
      debugEnabled: boolean;
      setDebugEnabled: (enabled: boolean) => void;
      isDev: boolean;
    }
  | typeof CONTEXT_NOT_PROVIDED
>(CONTEXT_NOT_PROVIDED);

export default function DebugContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDev = process.env.NODE_ENV === 'development';

  const [debugEnabled, setDebugEnabled] = useState(isDev);

  return (
    <DebugContext.Provider value={{ debugEnabled, setDebugEnabled, isDev }}>
      {children}
    </DebugContext.Provider>
  );
}

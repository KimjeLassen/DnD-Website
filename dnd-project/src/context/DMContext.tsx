import { createContext, useContext, useState, ReactNode } from 'react';

interface DMContextType {
  isDM: boolean;
  unlockDM: () => void;
  lockDM: () => void;
}

const DMContext = createContext<DMContextType | undefined>(undefined);

export function DMProvider({ children }: { children: ReactNode }) {
  const [isDM, setIsDM] = useState(false);

  const unlockDM = () => setIsDM(true);
  const lockDM = () => setIsDM(false);

  return (
    <DMContext.Provider value={{ isDM, unlockDM, lockDM }}>
      {children}
    </DMContext.Provider>
  );
}

export function useDM() {
  const context = useContext(DMContext);
  if (!context) {
    throw new Error('useDM must be used within a DMProvider');
  }
  return context;
}

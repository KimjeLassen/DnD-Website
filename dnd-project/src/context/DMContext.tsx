import { createContext, useContext, useState, type ReactNode } from 'react';
import { usersAPI } from '../services/api';

export interface User {
  id: string;
  name: string;
  role: string;
}

interface DMContextType {
  isDM: boolean;
  unlockDM: () => void;
  lockDM: () => void;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  currentUser: User | null;
  isLoading: boolean;
}

const DMContext = createContext<DMContextType | undefined>(undefined);

export function DMProvider({ children }: { children: ReactNode }) {
  const [isDM, setIsDM] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const unlockDM = () => setIsDM(true);
  const lockDM = () => setIsDM(false);
  
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Try to login with existing credentials
      const noget = await usersAPI.login(username, password); 

//      const loginResponse = await fetch('http://localhost:5000/api/users/login', {
//        method: 'POST',
//        headers: { 'Content-Type': 'application/json' },
//        body: JSON.stringify({ name: username, password })
//      });

      if (noget) {
        setCurrentUser(noget);
        if (noget.role === 'dungeon master')
        {
          setIsDM(true);
        }
        setIsLoggedIn(true);
        return;
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsDM(false);
  };

  return (
    <DMContext.Provider value={{ isDM, unlockDM, lockDM, isLoggedIn, login, logout, currentUser, isLoading }}>
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

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { usersAPI } from '../services/api';
import {
  setAccessToken,
  setRefreshToken,
  clearTokens,
  hasValidAccessToken,
  getDecodedToken,
  getAccessToken,
} from '../services/authUtils';

export interface User {
  id: string;
  name: string;
  role: string;
}

interface DMContextType {
  isDM: boolean;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  currentUser: User | null;
  isLoading: boolean;
}

const DMContext = createContext<DMContextType | undefined>(undefined);

const isDungeonMaster = (role: string) => role === 'dungeon master';

export function DMProvider({ children }: { children: ReactNode }) {
  const [isDM, setIsDM] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!hasValidAccessToken()) return;

    const token = getAccessToken();
    if (!token) return;

    const decoded = getDecodedToken(token);
    if (!decoded) return;

    setCurrentUser({
      id: decoded.userId || '',
      name: decoded.username,
      role: decoded.role,
    });
    setIsLoggedIn(true);
    setIsDM(isDungeonMaster(decoded.role));
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await usersAPI.login(username, password);

      setAccessToken(response.tokens.accessToken);
      if (response.tokens.refreshToken) {
        setRefreshToken(response.tokens.refreshToken);
      }

      setCurrentUser(response.user);
      setIsDM(isDungeonMaster(response.user.role));
      setIsLoggedIn(true);
    } catch (error) {
      clearTokens();
      setIsDM(false);
      setIsLoggedIn(false);
      setCurrentUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearTokens();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsDM(false);
  };

  return (
    <DMContext.Provider
      value={{ isDM, isLoggedIn, login, logout, currentUser, isLoading }}
    >
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

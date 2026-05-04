import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { usersAPI } from '../services/api';
import { 
  setAccessToken, 
  setRefreshToken, 
  clearTokens, 
  hasValidAccessToken,
  getDecodedToken,
  getAccessToken
} from '../services/authUtils';

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

  // Check if user is already logged in on mount
  useEffect(() => {
    if (hasValidAccessToken()) {
      const token = getAccessToken();
      if (token) {
        const decoded = getDecodedToken(token);
        if (decoded) {
          setCurrentUser({
            id: decoded.userId || '',
            name: decoded.username,
            role: decoded.role
          });
          setIsLoggedIn(true);
          if (decoded.role === 'dungeon master') {
            setIsDM(true);
          }
        }
      }
    }
  }, []);

  const unlockDM = () => setIsDM(true);
  const lockDM = () => setIsDM(false);
  
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await usersAPI.login(username, password);
      
      // Store tokens
      setAccessToken(response.tokens.accessToken);
      if (response.tokens.refreshToken) {
        setRefreshToken(response.tokens.refreshToken);
      }

      // Store user info
      setCurrentUser(response.user);
      if (response.user.role === 'dungeon master') {
        setIsDM(true);
      }
      setIsLoggedIn(true);
    } catch (error) {
      clearTokens();
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

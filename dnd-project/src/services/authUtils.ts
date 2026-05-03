import { jwtDecode } from 'jwt-decode';
import { type jwtToken } from '../types/tokenPayload';

export const getDecodedToken = (token: string): jwtToken | null => {
  try {
    return jwtDecode<jwtToken>(token);
  } catch (error) {
    console.error("Invalid token format", error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = getDecodedToken(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000; // JWT 'exp' is in seconds
  return decoded.exp < currentTime;
};
import { jwtDecode } from 'jwt-decode';
import { type jwtToken } from '../types/tokenPayload';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

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

/**
 * Store access token in localStorage
 */
export const setAccessToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

/**
 * Store refresh token in localStorage
 */
export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/**
 * Get access token from localStorage
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Clear all tokens from localStorage
 */
export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Check if user has a valid access token
 */
export const hasValidAccessToken = (): boolean => {
  const token = getAccessToken();
  return token !== null && !isTokenExpired(token);
};

/**
 * Get Authorization header value with bearer token
 */
export const getAuthorizationHeader = (): { Authorization: string } | null => {
  const token = getAccessToken();
  if (!token) return null;
  return { Authorization: `Bearer ${token}` };
};

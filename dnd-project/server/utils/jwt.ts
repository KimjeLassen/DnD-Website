import jwt from 'jsonwebtoken'
import { type JwtPayload, type JwtTokens } from '../types/jwt'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'
const ACCESS_TOKEN_EXPIRY = '24h'
const REFRESH_TOKEN_EXPIRY = '7d'

/**
 * Generate JWT tokens for a user
 */
export const generateTokens = (payload: Omit<JwtPayload, 'iat' | 'exp'>): JwtTokens => {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  })

  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  })

  return { accessToken, refreshToken }
}

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return decoded
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) return null
  
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }
  
  return parts[1]
}

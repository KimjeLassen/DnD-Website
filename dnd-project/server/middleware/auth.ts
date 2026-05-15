import { type Request, type Response, type NextFunction } from 'express'
import { extractTokenFromHeader, verifyToken } from '../utils/jwt'
import { type JwtPayload } from '../types/jwt'

/**
 * Extend Express Request to include user payload
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

/**
 * Authentication middleware - verifies JWT token from Authorization header
 * Attaches decoded user payload to request.user
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const payload = verifyToken(token)
    
    if (!payload) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.user = payload
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed', details: error })
  }
}

/**
 * Optional authentication middleware - doesn't fail if no token, but adds user if valid token provided
 */
const DM_ROLE = 'dungeon master'

export const dmMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  if (req.user.role !== DM_ROLE) {
    return res.status(403).json({ error: 'Dungeon Master access required' })
  }
  next()
}

export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    
    if (token) {
      const payload = verifyToken(token)
      if (payload) {
        req.user = payload
      }
    }
    
    next()
  } catch (error) {
    // Log error but continue - this is optional auth
    console.error('Optional auth error:', error)
    next()
  }
}

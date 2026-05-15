import { type Request, type Response, type NextFunction } from 'express'
import { authMiddleware } from './auth'

const PUBLIC_ROUTES: Array<{ method: string; path: string }> = [
  { method: 'GET', path: '/api/health' },
  { method: 'POST', path: '/api/users/login' },
]

export const apiAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.path.startsWith('/api')) {
    return next()
  }

  const isPublic = PUBLIC_ROUTES.some(
    (route) => route.method === req.method && req.path === route.path
  )

  if (isPublic) {
    return next()
  }

  return authMiddleware(req, res, next)
}

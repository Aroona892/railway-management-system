import { envServer } from '../config/env.js'
import { HttpError } from '../utils/http-error.js'
import { verifyAccessToken } from '../auth/tokens.js'

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    next(new HttpError(401, 'Missing Authorization header'))
    return
  }

  const token = header.slice('Bearer '.length)
  try {
    const payload = verifyAccessToken(token, { secret: envServer.JWT_SECRET })
    req.auth = { userId: payload.sub, role: payload.role }
    next()
  } catch {
    next(new HttpError(401, 'Invalid or expired token'))
  }
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    const role = req.auth?.role
    if (!role) {
      next(new HttpError(401, 'Unauthorized'))
      return
    }
    if (!roles.includes(role)) {
      next(new HttpError(403, 'Forbidden'))
      return
    }
    next()
  }
}


import { ZodError } from 'zod'

import { HttpError } from '../utils/http-error.js'

export function validate({ body, query, params }) {
  return (req, _res, next) => {
    try {
      if (body) req.body = body.parse(req.body)
      if (query) {
        const parsed = query.parse(req.query)
        // Express 5 exposes `req.query` via a getter (no setter), so merge in-place.
        const target = req.query
        if (target && typeof target === 'object') {
          for (const key of Object.keys(target)) delete target[key]
          Object.assign(target, parsed)
        }
      }
      if (params) req.params = params.parse(req.params)
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        next(new HttpError(400, err.issues.map((i) => i.message).join(', ')))
        return
      }
      next(err)
    }
  }
}


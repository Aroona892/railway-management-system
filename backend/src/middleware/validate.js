import { ZodError } from 'zod'

import { HttpError } from '../utils/http-error.js'

export function validate({ body, query, params }) {
  return (req, _res, next) => {
    try {
      if (body) req.body = body.parse(req.body)
      if (query) req.query = query.parse(req.query)
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


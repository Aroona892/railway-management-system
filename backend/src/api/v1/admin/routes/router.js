import { Router } from 'express'

import { Route } from '../../../../models/Route.js'
import { requireAuth, requireRole } from '../../../../middleware/auth.js'
import { validate } from '../../../../middleware/validate.js'
import { asyncHandler } from '../../../../utils/async-handler.js'
import { HttpError } from '../../../../utils/http-error.js'
import { idParamSchema, routeCreateSchema, routeUpdateSchema } from './schemas.js'

export const adminRoutesRouter = Router()

adminRoutesRouter.use(requireAuth, requireRole('ADMIN'))

adminRoutesRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const items = await Route.find().sort({ code: 1 }).lean()
    res.json({ items })
  }),
)

adminRoutesRouter.post(
  '/',
  validate({ body: routeCreateSchema }),
  asyncHandler(async (req, res) => {
    try {
      const created = await Route.create(req.body)
      res.status(201).json({ item: created })
    } catch (err) {
      if (err?.code === 11000) throw new HttpError(409, 'Route code already exists')
      throw err
    }
  }),
)

adminRoutesRouter.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const item = await Route.findById(req.params.id).populate('stops.station').lean()
    if (!item) throw new HttpError(404, 'Route not found')
    res.json({ item })
  }),
)

adminRoutesRouter.patch(
  '/:id',
  validate({ params: idParamSchema, body: routeUpdateSchema }),
  asyncHandler(async (req, res) => {
    try {
      const item = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true })
      if (!item) throw new HttpError(404, 'Route not found')
      res.json({ item })
    } catch (err) {
      if (err?.code === 11000) throw new HttpError(409, 'Route code already exists')
      throw err
    }
  }),
)

adminRoutesRouter.delete(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const item = await Route.findByIdAndDelete(req.params.id)
    if (!item) throw new HttpError(404, 'Route not found')
    res.status(204).send()
  }),
)


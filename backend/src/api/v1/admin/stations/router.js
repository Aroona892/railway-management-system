import { Router } from 'express'

import { Station } from '../../../../models/Station.js'
import { requireAuth, requireRole } from '../../../../middleware/auth.js'
import { validate } from '../../../../middleware/validate.js'
import { asyncHandler } from '../../../../utils/async-handler.js'
import { HttpError } from '../../../../utils/http-error.js'
import { idParamSchema, stationCreateSchema, stationUpdateSchema } from './schemas.js'

export const adminStationsRouter = Router()

adminStationsRouter.use(requireAuth, requireRole('ADMIN'))

adminStationsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const items = await Station.find().sort({ code: 1 }).lean()
    res.json({ items })
  }),
)

adminStationsRouter.post(
  '/',
  validate({ body: stationCreateSchema }),
  asyncHandler(async (req, res) => {
    try {
      const created = await Station.create(req.body)
      res.status(201).json({ item: created })
    } catch (err) {
      // Duplicate key (code)
      if (err?.code === 11000) throw new HttpError(409, 'Station code already exists')
      throw err
    }
  }),
)

adminStationsRouter.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const item = await Station.findById(req.params.id).lean()
    if (!item) throw new HttpError(404, 'Station not found')
    res.json({ item })
  }),
)

adminStationsRouter.patch(
  '/:id',
  validate({ params: idParamSchema, body: stationUpdateSchema }),
  asyncHandler(async (req, res) => {
    try {
      const item = await Station.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
      if (!item) throw new HttpError(404, 'Station not found')
      res.json({ item })
    } catch (err) {
      if (err?.code === 11000) throw new HttpError(409, 'Station code already exists')
      throw err
    }
  }),
)

adminStationsRouter.delete(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const item = await Station.findByIdAndDelete(req.params.id)
    if (!item) throw new HttpError(404, 'Station not found')
    res.status(204).send()
  }),
)


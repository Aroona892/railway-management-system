import { Router } from 'express'

import { Train } from '../../../../models/Train.js'
import { requireAuth, requireRole } from '../../../../middleware/auth.js'
import { validate } from '../../../../middleware/validate.js'
import { asyncHandler } from '../../../../utils/async-handler.js'
import { HttpError } from '../../../../utils/http-error.js'
import { idParamSchema, trainCreateSchema, trainUpdateSchema } from './schemas.js'

export const adminTrainsRouter = Router()

adminTrainsRouter.use(requireAuth, requireRole('ADMIN'))

adminTrainsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const items = await Train.find().sort({ number: 1 }).lean()
    res.json({ items })
  }),
)

adminTrainsRouter.post(
  '/',
  validate({ body: trainCreateSchema }),
  asyncHandler(async (req, res) => {
    try {
      const created = await Train.create(req.body)
      res.status(201).json({ item: created })
    } catch (err) {
      if (err?.code === 11000) throw new HttpError(409, 'Train number already exists')
      throw err
    }
  }),
)

adminTrainsRouter.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const item = await Train.findById(req.params.id).lean()
    if (!item) throw new HttpError(404, 'Train not found')
    res.json({ item })
  }),
)

adminTrainsRouter.patch(
  '/:id',
  validate({ params: idParamSchema, body: trainUpdateSchema }),
  asyncHandler(async (req, res) => {
    try {
      const item = await Train.findByIdAndUpdate(req.params.id, req.body, { new: true })
      if (!item) throw new HttpError(404, 'Train not found')
      res.json({ item })
    } catch (err) {
      if (err?.code === 11000) throw new HttpError(409, 'Train number already exists')
      throw err
    }
  }),
)

adminTrainsRouter.delete(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const item = await Train.findByIdAndDelete(req.params.id)
    if (!item) throw new HttpError(404, 'Train not found')
    res.status(204).send()
  }),
)


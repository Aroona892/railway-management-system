import { Router } from 'express'

import { Schedule } from '../../../../models/Schedule.js'
import { requireAuth, requireRole } from '../../../../middleware/auth.js'
import { validate } from '../../../../middleware/validate.js'
import { asyncHandler } from '../../../../utils/async-handler.js'
import { HttpError } from '../../../../utils/http-error.js'
import { idParamSchema, scheduleCreateSchema, scheduleUpdateSchema } from './schemas.js'

export const adminSchedulesRouter = Router()

adminSchedulesRouter.use(requireAuth, requireRole('ADMIN'))

adminSchedulesRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const items = await Schedule.find()
      .sort({ departureDate: -1 })
      .populate('train route')
      .lean()
    res.json({ items })
  }),
)

adminSchedulesRouter.post(
  '/',
  validate({ body: scheduleCreateSchema }),
  asyncHandler(async (req, res) => {
    const created = await Schedule.create(req.body)
    res.status(201).json({ item: created })
  }),
)

adminSchedulesRouter.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const item = await Schedule.findById(req.params.id).populate('train route').lean()
    if (!item) throw new HttpError(404, 'Schedule not found')
    res.json({ item })
  }),
)

adminSchedulesRouter.patch(
  '/:id',
  validate({ params: idParamSchema, body: scheduleUpdateSchema }),
  asyncHandler(async (req, res) => {
    const item = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!item) throw new HttpError(404, 'Schedule not found')
    res.json({ item })
  }),
)

adminSchedulesRouter.delete(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const item = await Schedule.findByIdAndDelete(req.params.id)
    if (!item) throw new HttpError(404, 'Schedule not found')
    res.status(204).send()
  }),
)


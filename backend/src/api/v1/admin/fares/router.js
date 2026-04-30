import { Router } from 'express'

import { FareRule } from '../../../../models/FareRule.js'
import { requireAuth, requireRole } from '../../../../middleware/auth.js'
import { validate } from '../../../../middleware/validate.js'
import { asyncHandler } from '../../../../utils/async-handler.js'
import { HttpError } from '../../../../utils/http-error.js'
import { fareCreateSchema, fareUpdateSchema, idParamSchema } from './schemas.js'

export const adminFaresRouter = Router()

adminFaresRouter.use(requireAuth, requireRole('ADMIN'))

adminFaresRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const items = await FareRule.find().sort({ class: 1 }).lean()
    res.json({ items })
  }),
)

adminFaresRouter.post(
  '/',
  validate({ body: fareCreateSchema }),
  asyncHandler(async (req, res) => {
    try {
      const created = await FareRule.create(req.body)
      res.status(201).json({ item: created })
    } catch (err) {
      if (err?.code === 11000) throw new HttpError(409, 'Fare rule for class already exists')
      throw err
    }
  }),
)

adminFaresRouter.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const item = await FareRule.findById(req.params.id).lean()
    if (!item) throw new HttpError(404, 'Fare rule not found')
    res.json({ item })
  }),
)

adminFaresRouter.patch(
  '/:id',
  validate({ params: idParamSchema, body: fareUpdateSchema }),
  asyncHandler(async (req, res) => {
    try {
      const item = await FareRule.findByIdAndUpdate(req.params.id, req.body, { new: true })
      if (!item) throw new HttpError(404, 'Fare rule not found')
      res.json({ item })
    } catch (err) {
      if (err?.code === 11000) throw new HttpError(409, 'Fare rule for class already exists')
      throw err
    }
  }),
)

adminFaresRouter.delete(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    const item = await FareRule.findByIdAndDelete(req.params.id)
    if (!item) throw new HttpError(404, 'Fare rule not found')
    res.status(204).send()
  }),
)


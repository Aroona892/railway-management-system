import { Router } from 'express'

import { authRouter } from './auth/router.js'
import { adminStationsRouter } from './admin/stations/router.js'
import { adminTrainsRouter } from './admin/trains/router.js'
import { adminRoutesRouter } from './admin/routes/router.js'
import { adminSchedulesRouter } from './admin/schedules/router.js'
import { adminFaresRouter } from './admin/fares/router.js'

export const v1Router = Router()

v1Router.get('/', (_req, res) => {
  res.json({ ok: true, version: 1 })
})

v1Router.use('/auth', authRouter)
v1Router.use('/admin/stations', adminStationsRouter)
v1Router.use('/admin/trains', adminTrainsRouter)
v1Router.use('/admin/routes', adminRoutesRouter)
v1Router.use('/admin/schedules', adminSchedulesRouter)
v1Router.use('/admin/fares', adminFaresRouter)


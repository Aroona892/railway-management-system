import { Router } from 'express'
import { z } from 'zod'

import { Schedule } from '../../../models/Schedule.js'
import { validate } from '../../../middleware/validate.js'
import { asyncHandler } from '../../../utils/async-handler.js'

const scheduleQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  from: z.string().trim().min(1).optional(),
  to: z.string().trim().min(1).optional(),
  active: z
    .union([z.literal('true'), z.literal('false')])
    .optional(),
})

function normalizeStationKey(input) {
  return String(input || '')
    .trim()
    .toUpperCase()
}

export const schedulesRouter = Router()

/**
 * Public schedules endpoint for passenger UI.
 * Optional filters:
 * - date: YYYY-MM-DD (matches departureDate day)
 * - from/to: station code (e.g., KHI) OR substring of station/city name
 * - active: true|false
 */
schedulesRouter.get(
  '/',
  validate({ query: scheduleQuerySchema }),
  asyncHandler(async (req, res) => {
    const { date, from, to, active } = req.query

    const mongoQuery = {}

    if (active === 'true') mongoQuery.isActive = true
    if (active === 'false') mongoQuery.isActive = false

    if (date) {
      // Treat date as a day bucket; departureDate is stored as Date.
      const start = new Date(`${date}T00:00:00.000Z`)
      const end = new Date(`${date}T23:59:59.999Z`)
      mongoQuery.departureDate = { $gte: start, $lte: end }
    }

    const items = await Schedule.find(mongoQuery)
      .sort({ departureDate: 1, departureTime: 1 })
      .populate('train')
      .populate({
        path: 'route',
        populate: { path: 'stops.station' },
      })
      .lean()

    const fromKey = normalizeStationKey(from)
    const toKey = normalizeStationKey(to)

    // If no route filters are requested, return items as-is (even if route population fails).
    if (!fromKey && !toKey) {
      res.json({ items })
      return
    }

    const filtered = items.filter((s) => {
      const route = s.route
      if (!route || !Array.isArray(route.stops)) return false

      const stops = route.stops
        .slice()
        .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
        .map((st) => {
          const station = st.station || {}
          const code = normalizeStationKey(station.code)
          const name = String(station.name || '').toLowerCase()
          const city = String(station.city || '').toLowerCase()
          return { code, name, city, sequence: st.sequence ?? 0 }
        })

      const matchStop = (key, stop) => {
        if (!key) return true
        const lower = key.toLowerCase()
        return stop.code === key || stop.name.includes(lower) || stop.city.includes(lower)
      }

      const fromIdx = fromKey ? stops.findIndex((st) => matchStop(fromKey, st)) : 0
      const toIdx = toKey ? stops.findIndex((st) => matchStop(toKey, st)) : stops.length - 1

      if (fromKey && fromIdx < 0) return false
      if (toKey && toIdx < 0) return false
      return fromIdx <= toIdx
    })

    res.json({ items: filtered })
  }),
)


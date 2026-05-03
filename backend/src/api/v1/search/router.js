import { Router } from 'express'

import { Schedule } from '../../../models/Schedule.js'
import { Booking } from '../../../models/Booking.js'
import { validate } from '../../../middleware/validate.js'
import { asyncHandler } from '../../../utils/async-handler.js'
import { searchQuerySchema } from './schemas.js'

export const searchRouter = Router()

// GET /api/v1/search/trains?fromStationId=&toStationId=&date=YYYY-MM-DD&classType=
searchRouter.get(
  '/',
  validate({ query: searchQuerySchema }),
  asyncHandler(async (req, res) => {
    const { fromStationId, toStationId, date, classType } = req.query

    // Match schedules whose departureDate falls on the requested calendar day (UTC)
    const dayStart = new Date(`${date}T00:00:00.000Z`)
    const dayEnd = new Date(`${date}T23:59:59.999Z`)

    const schedules = await Schedule.find({
      isActive: true,
      departureDate: { $gte: dayStart, $lte: dayEnd },
    })
      .populate({ path: 'train', match: { isActive: true } })
      .populate({
        path: 'route',
        match: { isActive: true },
        populate: { path: 'stops.station' },
      })
      .lean()

    // Pre-fetch booked seat counts for all matching schedules in one aggregation
    const scheduleIds = schedules.map((s) => s._id)
    const bookedAgg = await Booking.aggregate([
      {
        $match: {
          scheduleId: { $in: scheduleIds },
          date,
          status: 'CONFIRMED',
        },
      },
      {
        $group: {
          _id: { scheduleId: '$scheduleId', classType: '$classType' },
          bookedCount: { $sum: { $size: '$seatsAssigned' } },
        },
      },
    ])

    // Build lookup: scheduleId+classType → bookedCount
    const bookedLookup = {}
    for (const row of bookedAgg) {
      const key = `${row._id.scheduleId}|${row._id.classType}`
      bookedLookup[key] = row.bookedCount
    }

    const results = []

    for (const sched of schedules) {
      // populate returns null when match condition fails
      if (!sched.train || !sched.route) continue

      const stops = sched.route.stops

      const fromStop = stops.find((s) => s.station?._id.toString() === fromStationId)
      const toStop = stops.find((s) => s.station?._id.toString() === toStationId)

      // Both stations must exist in route and fromStation must precede toStation
      if (!fromStop || !toStop || fromStop.sequence >= toStop.sequence) continue

      // Group coaches by class to compute totals
      const coachGroups = {}
      for (const coach of sched.train.coaches) {
        if (!coachGroups[coach.class]) {
          coachGroups[coach.class] = { totalSeats: 0 }
        }
        coachGroups[coach.class].totalSeats += coach.seatCount
      }

      // If classType filter is provided, skip trains that don't have that class
      if (classType && !coachGroups[classType]) continue

      // Compute per-class availability
      const classesToShow = classType ? [classType] : Object.keys(coachGroups)
      const availableClasses = []
      const availability = []

      for (const cls of classesToShow) {
        const group = coachGroups[cls]
        if (!group) continue
        const booked = bookedLookup[`${sched._id}|${cls}`] ?? 0
        const available = Math.max(0, group.totalSeats - booked)
        if (available > 0) availableClasses.push(cls)
        availability.push({ classType: cls, totalSeats: group.totalSeats, availableSeats: available })
      }

      // Derive departure/arrival times from base departureTime + route offsets
      const [baseH, baseM] = sched.departureTime.split(':').map(Number)
      const baseMins = baseH * 60 + baseM

      const depMins = baseMins + (fromStop.departureOffsetMin ?? 0)
      const departureTime = minsToHHMM(depMins)

      let arrivalTime = null
      if (toStop.arrivalOffsetMin != null) {
        arrivalTime = minsToHHMM(baseMins + toStop.arrivalOffsetMin)
      }

      results.push({
        scheduleId: sched._id,
        trainId: sched.train._id,
        trainNumber: sched.train.number,
        trainName: sched.train.name,
        fromStation: {
          _id: fromStop.station._id,
          name: fromStop.station.name,
          code: fromStop.station.code,
        },
        toStation: {
          _id: toStop.station._id,
          name: toStop.station.name,
          code: toStop.station.code,
        },
        date,
        departureTime,
        arrivalTime,
        availableClasses,
        availability,
      })
    }

    res.json({ items: results })
  }),
)

function minsToHHMM(totalMins) {
  const h = Math.floor(totalMins / 60) % 24
  const m = totalMins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
import crypto from 'crypto'
import { Router } from 'express'

import { Booking } from '../../../models/Booking.js'
import { Schedule } from '../../../models/Schedule.js'
import { Train } from '../../../models/Train.js'
import { Route } from '../../../models/Route.js'
import { Station } from '../../../models/Station.js'
import { requireAuth } from '../../../middleware/auth.js'
import { validate } from '../../../middleware/validate.js'
import { asyncHandler } from '../../../utils/async-handler.js'
import { HttpError } from '../../../utils/http-error.js'
import { bookingCreateSchema, pnrParamSchema } from './schemas.js'

export const bookingsRouter = Router()

// All booking endpoints require a logged-in user
bookingsRouter.use(requireAuth)

// ─── POST /api/v1/bookings ─────────────────────────────────────────────────
bookingsRouter.post(
  '/',
  validate({ body: bookingCreateSchema }),
  asyncHandler(async (req, res) => {
    const {
      scheduleId,
      trainId,
      fromStation: fromStationId,
      toStation: toStationId,
      date,
      classType,
      passengers,
    } = req.body
    const userId = req.auth.userId

    // Validate schedule
    const schedule = await Schedule.findById(scheduleId).lean()
    if (!schedule || !schedule.isActive) throw new HttpError(404, 'Schedule not found or inactive')

    // Validate train and confirm it matches the schedule
    const train = await Train.findById(trainId).lean()
    if (!train || !train.isActive) throw new HttpError(404, 'Train not found or inactive')
    if (schedule.train.toString() !== trainId) {
      throw new HttpError(400, 'Train does not match schedule')
    }

    // Validate stations exist
    const [fromStation, toStation] = await Promise.all([
      Station.findById(fromStationId).lean(),
      Station.findById(toStationId).lean(),
    ])
    if (!fromStation) throw new HttpError(404, 'From station not found')
    if (!toStation) throw new HttpError(404, 'To station not found')

    // Validate both stations are stops on the route, and fromStation precedes toStation
    const route = await Route.findById(schedule.route).lean()
    if (!route) throw new HttpError(404, 'Route not found')

    const fromStop = route.stops.find((s) => s.station.toString() === fromStationId)
    const toStop = route.stops.find((s) => s.station.toString() === toStationId)
    if (!fromStop) throw new HttpError(400, 'From station is not on this route')
    if (!toStop) throw new HttpError(400, 'To station is not on this route')
    if (fromStop.sequence >= toStop.sequence) {
      throw new HttpError(400, 'From station must come before to station in the route')
    }

    // Validate the requested class exists on this train
    const coachesForClass = train.coaches.filter((c) => c.class === classType)
    if (coachesForClass.length === 0) {
      throw new HttpError(400, `Class ${classType} is not available on this train`)
    }

    // Fetch all CONFIRMED bookings for this schedule/date/class to determine taken seats
    const confirmedBookings = await Booking.find({
      scheduleId,
      date,
      classType,
      status: 'CONFIRMED',
    }).lean()

    // Build per-coach set of booked seat numbers: Map<coachCode, Set<seatNumber>>
    const bookedSeatsMap = new Map()
    for (const booking of confirmedBookings) {
      for (const seat of booking.seatsAssigned) {
        if (!bookedSeatsMap.has(seat.coachCode)) {
          bookedSeatsMap.set(seat.coachCode, new Set())
        }
        bookedSeatsMap.get(seat.coachCode).add(seat.seatNumber)
      }
    }

    // Build ordered pool of available seats (first coach first, seat 1 first)
    const availablePool = []
    for (const coach of coachesForClass) {
      const taken = bookedSeatsMap.get(coach.code) ?? new Set()
      for (let seatNum = 1; seatNum <= coach.seatCount; seatNum++) {
        if (!taken.has(seatNum)) {
          availablePool.push({ coachCode: coach.code, seatNumber: seatNum })
        }
      }
    }

    if (availablePool.length < passengers.length) {
      throw new HttpError(
        400,
        `Not enough seats available. Requested: ${passengers.length}, available: ${availablePool.length}`,
      )
    }

    // First-fit seat assignment
    const seatsAssigned = passengers.map((passenger, idx) => ({
      passengerName: passenger.name,
      coachCode: availablePool[idx].coachCode,
      seatNumber: availablePool[idx].seatNumber,
      classType,
    }))

    // Generate unique PNR (retry up to 5 times on collision)
    let pnr
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = 'PNR' + crypto.randomBytes(4).toString('hex').toUpperCase()
      const exists = await Booking.findOne({ pnr: candidate }).lean()
      if (!exists) {
        pnr = candidate
        break
      }
    }
    if (!pnr) throw new HttpError(500, 'Failed to generate a unique PNR, please try again')

    const booking = await Booking.create({
      pnr,
      userId,
      trainId,
      scheduleId,
      fromStation: fromStationId,
      toStation: toStationId,
      date,
      classType,
      passengers,
      seatsAssigned,
      status: 'CONFIRMED',
    })

    res.status(201).json({ item: booking })
  }),
)

// ─── GET /api/v1/bookings/me ───────────────────────────────────────────────
// Must be defined BEFORE /:pnr so Express does not treat "me" as a PNR param
bookingsRouter.get(
  '/me',
  asyncHandler(async (req, res) => {
    const userId = req.auth.userId
    const items = await Booking.find({ userId })
      .sort({ createdAt: -1 })
      .populate('trainId', 'number name')
      .populate('fromStation', 'name code')
      .populate('toStation', 'name code')
      .lean()
    res.json({ items })
  }),
)

// ─── GET /api/v1/bookings/:pnr ─────────────────────────────────────────────
bookingsRouter.get(
  '/:pnr',
  validate({ params: pnrParamSchema }),
  asyncHandler(async (req, res) => {
    const item = await Booking.findOne({ pnr: req.params.pnr })
      .populate('trainId', 'number name')
      .populate('fromStation', 'name code')
      .populate('toStation', 'name code')
      .lean()
    if (!item) throw new HttpError(404, 'PNR not found')

    // Passengers can only view their own bookings; admin/staff can view all
    const { userId, role } = req.auth
    if (role === 'PASSENGER' && item.userId.toString() !== userId) {
      throw new HttpError(403, 'Forbidden')
    }

    res.json({ item })
  }),
)

// ─── POST /api/v1/bookings/:pnr/cancel ────────────────────────────────────
bookingsRouter.post(
  '/:pnr/cancel',
  validate({ params: pnrParamSchema }),
  asyncHandler(async (req, res) => {
    const booking = await Booking.findOne({ pnr: req.params.pnr })
    if (!booking) throw new HttpError(404, 'Booking not found')

    // Passengers can only cancel their own bookings; admin/staff can cancel any
    const { userId, role } = req.auth
    if (role === 'PASSENGER' && booking.userId.toString() !== userId) {
      throw new HttpError(403, 'Forbidden')
    }

    if (booking.status === 'CANCELLED') {
      throw new HttpError(409, 'Booking is already cancelled')
    }

    booking.status = 'CANCELLED'
    booking.cancelledAt = new Date()
    await booking.save()

    res.json({
      item: {
        pnr: booking.pnr,
        status: booking.status,
        cancelledAt: booking.cancelledAt,
      },
    })
  }),
)
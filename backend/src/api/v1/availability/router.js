import { Router } from 'express'

import { Schedule } from '../../../models/Schedule.js'
import { Booking } from '../../../models/Booking.js'
import { validate } from '../../../middleware/validate.js'
import { asyncHandler } from '../../../utils/async-handler.js'
import { HttpError } from '../../../utils/http-error.js'
import { availabilityQuerySchema } from './schemas.js'

export const availabilityRouter = Router()

// GET /api/v1/availability?scheduleId=&date=YYYY-MM-DD&classType=
availabilityRouter.get(
  '/',
  validate({ query: availabilityQuerySchema }),
  asyncHandler(async (req, res) => {
    const { scheduleId, date, classType } = req.query

    const schedule = await Schedule.findById(scheduleId).populate('train').lean()
    if (!schedule || !schedule.isActive) throw new HttpError(404, 'Schedule not found')

    const train = schedule.train
    if (!train || !train.isActive) throw new HttpError(404, 'Train not found or inactive')

    const coachesForClass = train.coaches.filter((c) => c.class === classType)
    if (coachesForClass.length === 0) {
      throw new HttpError(404, `No coaches of class ${classType} on this train`)
    }

    const totalSeats = coachesForClass.reduce((sum, c) => sum + c.seatCount, 0)

    // Only CONFIRMED bookings reduce availability; CANCELLED bookings free the seats
    const confirmedBookings = await Booking.find({
      scheduleId,
      date,
      classType,
      status: 'CONFIRMED',
    }).lean()

    // Count booked seats per coach
    const bookedByCoach = {}
    for (const booking of confirmedBookings) {
      for (const seat of booking.seatsAssigned) {
        bookedByCoach[seat.coachCode] = (bookedByCoach[seat.coachCode] ?? 0) + 1
      }
    }

    const totalBooked = Object.values(bookedByCoach).reduce((a, b) => a + b, 0)

    const coaches = coachesForClass.map((c) => {
      const booked = bookedByCoach[c.code] ?? 0
      return {
        coachCode: c.code,
        totalSeats: c.seatCount,
        bookedSeats: booked,
        availableSeats: c.seatCount - booked,
      }
    })

    res.json({
      item: {
        scheduleId,
        trainId: train._id,
        trainNumber: train.number,
        trainName: train.name,
        date,
        classType,
        totalSeats,
        bookedSeats: totalBooked,
        availableSeats: totalSeats - totalBooked,
        coaches,
      },
    })
  }),
)
import express from 'express'
import Booking from '../../../models/Booking.js'
import { sendBookingConfirmationEmail } from '../../../utils/email-service.js'
import { asyncHandler } from '../../../utils/async-handler.js'
import { validateRequest } from '../../../middleware/validate.js'
import { HttpError } from '../../../utils/http-error.js'
import { createBookingSchema } from './schemas.js'

const router = express.Router()

function generateBookingReference() {
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.random().toString(36).substr(2, 5).toUpperCase()
  return `BK-${timestamp}-${random}`
}

router.post(
  '/',
  validateRequest({
    body: createBookingSchema
  }),
  asyncHandler(async (req, res) => {
    const bookingData = req.body

    const reference = generateBookingReference()

    const booking = new Booking({
      reference,
      ...bookingData,
      status: 'confirmed'
    })

    await booking.save()

    const emailResult = await sendBookingConfirmationEmail(booking.toObject())

    if (emailResult.success) {
      booking.emailSent = true
      await booking.save()
    } else {
      console.warn(`Booking ${reference} created but email failed:`, emailResult.error)
    }

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully. Confirmation email sent.',
      booking: {
        reference: booking.reference,
        status: booking.status,
        bookedAt: booking.createdAt,
        totalAmount: booking.pricing.totalAmount
      },
      emailStatus: emailResult.success ? 'sent' : 'failed'
    })
  })
)

router.get(
  '/:reference',
  asyncHandler(async (req, res) => {
    const { reference } = req.params

    const booking = await Booking.findOne({ reference })

    if (!booking) {
      throw new HttpError(404, 'Booking not found')
    }

    res.json({
      success: true,
      booking: booking.toObject()
    })
  })
)

router.get(
  '/email/:email',
  asyncHandler(async (req, res) => {
    const { email } = req.params

    const bookings = await Booking.find({ 'contact.email': email })

    res.json({
      success: true,
      count: bookings.length,
      bookings: bookings.map(b => b.toObject())
    })
  })
)

export default router

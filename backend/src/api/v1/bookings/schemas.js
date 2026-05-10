import { z } from 'zod'

export const createBookingSchema = z.object({
  train: z.object({
    id: z.number(),
    name: z.string(),
    number: z.string(),
    source: z.string(),
    destination: z.string(),
    departureTime: z.string(),
    arrivalTime: z.string(),
    fare: z.number()
  }),
  travelDetails: z.object({
    journeyDate: z.string(),
    seatClass: z.string(),
    numPassengers: z.number().min(1)
  }),
  passengers: z.array(
    z.object({
      name: z.string(),
      age: z.number(),
      gender: z.string(),
      cnic: z.string()
    })
  ),
  contact: z.object({
    phone: z.string(),
    email: z.string().email()
  }),
  pricing: z.object({
    ticketTotal: z.number(),
    serviceCharge: z.number(),
    totalAmount: z.number()
  })
})

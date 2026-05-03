import { z } from 'zod'

const CLASS_TYPES = ['SL', '3A', '2A', '1A', 'CC', '2S']

const passengerSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().min(1).max(120),
  gender: z.string().min(1),
})

export const bookingCreateSchema = z.object({
  scheduleId: z.string().min(1),
  trainId: z.string().min(1),
  fromStation: z.string().min(1),
  toStation: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  classType: z.enum(CLASS_TYPES),
  passengers: z.array(passengerSchema).min(1),
})

export const pnrParamSchema = z.object({
  pnr: z.string().min(1).transform((s) => s.toUpperCase()),
})
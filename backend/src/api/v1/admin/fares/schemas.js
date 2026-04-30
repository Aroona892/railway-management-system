import { z } from 'zod'

export const fareCreateSchema = z.object({
  class: z.enum(['SL', '3A', '2A', '1A', 'CC', '2S']),
  currency: z.string().min(1).optional(),
  baseFare: z.number().min(0),
  perKm: z.number().min(0),
  minFare: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
})

export const fareUpdateSchema = fareCreateSchema.partial()

export const idParamSchema = z.object({
  id: z.string().min(1),
})


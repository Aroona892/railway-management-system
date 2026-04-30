import { z } from 'zod'

const coachSchema = z.object({
  code: z.string().min(1),
  class: z.enum(['SL', '3A', '2A', '1A', 'CC', '2S']),
  seatCount: z.number().int().positive(),
})

export const trainCreateSchema = z.object({
  number: z.string().min(1),
  name: z.string().min(2),
  coaches: z.array(coachSchema).optional(),
  isActive: z.boolean().optional(),
})

export const trainUpdateSchema = trainCreateSchema.partial()

export const idParamSchema = z.object({
  id: z.string().min(1),
})


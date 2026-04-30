import { z } from 'zod'

export const stationCreateSchema = z.object({
  code: z.string().min(2).max(10),
  name: z.string().min(2),
  city: z.string().min(2),
  state: z.string().optional(),
})

export const stationUpdateSchema = stationCreateSchema.partial()

export const idParamSchema = z.object({
  id: z.string().min(1),
})


import { z } from 'zod'

const stopSchema = z.object({
  station: z.string().min(1),
  sequence: z.number().int().min(0),
  arrivalOffsetMin: z.number().int().min(0).optional(),
  departureOffsetMin: z.number().int().min(0).optional(),
  dayOffset: z.number().int().min(0).optional(),
  platform: z.string().optional(),
})

export const routeCreateSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2).max(10),
  stops: z.array(stopSchema).optional(),
  isActive: z.boolean().optional(),
})

export const routeUpdateSchema = routeCreateSchema.partial()

export const idParamSchema = z.object({
  id: z.string().min(1),
})


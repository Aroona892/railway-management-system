import { z } from 'zod'

export const scheduleCreateSchema = z.object({
  train: z.string().min(1),
  route: z.string().min(1),
  departureDate: z.coerce.date(),
  departureTime: z.string().regex(/^\d{2}:\d{2}$/),
  runsOn: z
    .array(z.enum(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']))
    .optional(),
  isActive: z.boolean().optional(),
})

export const scheduleUpdateSchema = scheduleCreateSchema.partial()

export const idParamSchema = z.object({
  id: z.string().min(1),
})


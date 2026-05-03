import { z } from 'zod'

const CLASS_TYPES = ['SL', '3A', '2A', '1A', 'CC', '2S']

export const searchQuerySchema = z.object({
  fromStationId: z.string().min(1),
  toStationId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  classType: z.enum(CLASS_TYPES).optional(),
})
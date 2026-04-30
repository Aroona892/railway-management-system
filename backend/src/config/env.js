import 'dotenv/config'
import { z } from 'zod'

const baseSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().min(1).default('http://localhost:5173'),
})

const serverSchema = baseSchema.extend({
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(10).default('dev-secret-change-me'),
  JWT_EXPIRES_IN: z.string().min(1).default('7d'),
  SEED_ADMIN_NAME: z.string().min(1).default('Admin'),
  SEED_ADMIN_EMAIL: z.string().email().default('admin@example.com'),
  SEED_ADMIN_PASSWORD: z.string().min(6).default('admin123'),
})

function parseEnv(schema, label) {
  const parsed = schema.safeParse(process.env)
  if (!parsed.success) {
    throw new Error(
      `Invalid environment variables (${label}):\n${parsed.error.message}`,
    )
  }
  if (
    label === 'server' &&
    parsed.data.NODE_ENV === 'production' &&
    parsed.data.JWT_SECRET === 'dev-secret-change-me'
  ) {
    throw new Error('JWT_SECRET must be set in production')
  }
  return parsed.data
}

export const envBase = parseEnv(baseSchema, 'base')
export const envServer = parseEnv(serverSchema, 'server')


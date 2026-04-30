import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'

import { envBase } from './config/env.js'
import { v1Router } from './api/v1/index.js'
import { healthRouter } from './routes/health.js'
import { HttpError } from './utils/http-error.js'
import { createOpenApiSpec } from './docs/openapi.js'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: envBase.CORS_ORIGIN,
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '1mb' }))
  app.use(morgan('dev'))

  app.get('/', (_req, res) => {
    res.json({ name: 'rms-backend', status: 'ok' })
  })

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(createOpenApiSpec()))
  app.use('/health', healthRouter)
  app.use('/api/v1', v1Router)

  // 404 fallback
  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  // Error handler
  app.use((err, _req, res, _next) => {
    const status = err instanceof HttpError ? err.status : 500
    const message = err instanceof Error ? err.message : 'Internal server error'
    res.status(status).json({ error: message })
  })

  return app
}


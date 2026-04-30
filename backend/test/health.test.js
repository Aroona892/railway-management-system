import { describe, expect, it } from 'vitest'

import { createApp } from '../src/app.js'

describe('GET /health', () => {
  it('returns ok', async () => {
    const app = createApp()
    const server = app.listen(0)

    try {
      const address = server.address()
      if (address == null || typeof address === 'string') {
        throw new Error('Failed to bind ephemeral port')
      }

      const res = await fetch(`http://127.0.0.1:${address.port}/health`)
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.ok).toBe(true)
    } finally {
      await new Promise((resolve) => server.close(() => resolve()))
    }
  })
})


import { envServer } from './config/env.js'
import { connectMongo } from './db/connect.js'
import { createApp } from './app.js'

async function main() {
  const conn = await connectMongo(envServer.MONGODB_URI)
  conn.on('error', (err) => {
    console.error('Mongo connection error:', err)
  })

  const app = createApp()
  app.listen(envServer.PORT, () => {
    console.log(`API listening on http://localhost:${envServer.PORT}`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


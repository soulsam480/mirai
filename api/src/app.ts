import dotenv from 'dotenv'
import path, { join } from 'path'
import fastify from 'fastify'
import autoload from '@fastify/autoload'
import cors from '@fastify/cors'
// import cookies from '@fastify/cookie'
import ws from '@fastify/websocket'

import { getEnv } from './lib'
import type { SessionUser } from './rpc/context'

dotenv.config({ path: join(__dirname, '../.env') })

export async function createServer() {
  const dev = getEnv('NODE_ENV') !== 'production' ?? true
  const port = getEnv('PORT') !== undefined ? Number(getEnv('PORT')) : 4002

  const server = fastify({
    logger: dev && {
      prettyPrint: true,
    },
  })

  await server.register(cors, {
    preflight: true,
    origin: ['localhost:3000'],
  })

  await server.register(ws)

  await server.register(autoload, {
    dir: path.join(__dirname, 'routes'),
  })

  await server.register(autoload, {
    dir: path.join(__dirname, 'plugins'),
  })

  server.decorateRequest('session', function () {
    const authHeader = this.headers.authorization

    let session: SessionUser | null

    if (authHeader === undefined) {
      session = null
    } else {
      session = JSON.parse(authHeader) as SessionUser
    }

    return session
  })

  server.get('/', async () => {
    return "This is Mirai's API"
  })

  const start = async () => {
    try {
      await server.listen(port)

      if (process.env.NDE_ENV === 'development') server.log.info(`listening on http://localhost:${port}`)
    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }
  }

  await server.ready()

  void start()

  // eslint-disable-next-line @typescript-eslint/return-await
  return server
}

void createServer()

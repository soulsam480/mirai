import dotenv from 'dotenv'
import path, { join } from 'path'
import fastify from 'fastify'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'

import { appRouter } from './rpc/routers/_appRouter'
import { createContext, SessionUser } from './rpc/context'
import { getEnv, logger, setupBull } from './lib'
import autoload from '@fastify/autoload'
import cors from '@fastify/cors'
// import cookies from '@fastify/cookie'
import ws from '@fastify/websocket'
import { createMongoConnection } from './db'

dotenv.config({ path: join(__dirname, '../.env') })

export async function createServer() {
  const dev = getEnv('NODE_ENV') !== 'production' ?? true
  const port = getEnv('PORT') !== undefined ? Number(getEnv('PORT')) : 4002

  const server = fastify({
    logger: dev && {
      prettyPrint: true,
    },
  })

  void server.register(cors, {
    preflight: true,
    origin: ['localhost:3000'],
  })

  void server.register(ws)

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

  void server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext },
  })

  void server.register(autoload, {
    dir: path.join(__dirname, 'routes'),
  })

  server.get('/', async () => {
    return "This is Mirai's API"
  })

  setupBull(server)

  const start = async () => {
    try {
      await server.listen(port)

      if (process.env.NDE_ENV === 'development') logger.info(`listening on http://localhost:${port}`)
    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }
  }

  await server.ready()

  await createMongoConnection()

  void start()

  // eslint-disable-next-line @typescript-eslint/return-await
  return server
}

void createServer()

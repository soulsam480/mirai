import dotenv from 'dotenv'
import path, { join } from 'path'
import fastify from 'fastify'
import autoload from '@fastify/autoload'
import cors from '@fastify/cors'
import ws from '@fastify/websocket'
import { getEnv, logger } from './lib'
import type { SessionUser } from './rpc/context'

dotenv.config({ path: join(__dirname, '../.env') })

export async function createServer() {
  const dev = getEnv('NODE_ENV') !== 'production' ?? true
  const port = Number(getEnv('PORT', false) ?? 4002)

  const server = fastify({
    logger: dev && {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
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
      await server.listen({
        port,
      })
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  }

  await server.ready()

  await start()
}

void createServer()

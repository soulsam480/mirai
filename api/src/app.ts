import dotenv from 'dotenv'
import { join, dirname } from 'path'
import fastify from 'fastify'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'

import { appRouter } from './rpc/routers/_appRouter'
import { createContext } from './rpc/context'
import { fileURLToPath } from 'url'
import { getEnv, logger, setupBull } from './lib'
import { registerRoutes } from './routes'

const _dirname = typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(_dirname, '../.env') })

export function createServer() {
  const dev = getEnv('NODE_ENV') !== 'production' ?? true
  const port = getEnv('PORT') !== undefined ? Number(getEnv('PORT')) : 4002
  const server = fastify({
    logger: dev && {
      prettyPrint: true,
    },
  })

  void server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext },
  })

  void registerRoutes(server)

  server.get('/', async () => {
    return "This is Mirai's API"
  })

  setupBull(server)

  const start = async () => {
    try {
      await server.listen(port)
      // eslint-disable-next-line no-console
      console.log('listening at', logger.info(`http://localhost:${port}`))
    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }
  }

  if (getEnv('NODE_ENV') === 'production') {
    void start()
  }

  return server
}

export const viteNodeApp = createServer()

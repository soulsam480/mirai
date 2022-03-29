import dotenv from 'dotenv'
import { join, dirname } from 'path'
import fastify from 'fastify'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { appRouter } from './rpc/routers/appRouter'
import fp from 'fastify-plugin'
import { createContext } from './rpc/context'
import { fileURLToPath } from 'url'

const _dirname = typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(_dirname, '../.env') })

export interface ServerOptions {
  dev?: boolean
  port?: number
  prefix?: string
}

export function createServer(opts: ServerOptions) {
  const dev = opts.dev ?? true
  const port = opts.port ?? 4002
  const prefix = opts.prefix ?? '/trpc'
  const server = fastify({ logger: dev })

  void server.register(fp(fastifyTRPCPlugin), {
    prefix,
    trpcOptions: { router: appRouter, createContext },
  })

  server.get('/', async () => {
    return { hello: 'world' }
  })

  const start = async () => {
    try {
      await server.listen(port)
      console.log('listening on port', port)
    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }
  }

  if (import.meta.env.VITE_ENV === 'prod') {
    void start()
  }

  return server
}

export const viteNodeApp = createServer({})

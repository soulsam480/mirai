/* eslint-disable import/first */
require('tsconfig-paths/register')

import dotenv from 'dotenv'
import { join } from 'path'
import AutoLoad, { AutoloadPluginOptions } from 'fastify-autoload'
import fastify, { FastifyPluginAsync } from 'fastify'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { appRouter } from 'rpc/routers/appRouter'
import fp from 'fastify-plugin'
import { createContext } from 'rpc/context'

dotenv.config({ path: join(__dirname, '../.env') })

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>

const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts,
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  // void fastify.register(AutoLoad, {
  //   dir: join(__dirname, 'routes'),
  //   options: opts,
  // })
}

export interface ServerOptions {
  dev?: boolean
  port?: number
  prefix?: string
}

export function createServer(opts: ServerOptions) {
  const dev = opts.dev ?? true
  const port = opts.port ?? 3000
  const prefix = opts.prefix ?? '/trpc'
  const server = fastify({ logger: dev })

  void server.register(fp(fastifyTRPCPlugin), {
    prefix,
    trpcOptions: { router: appRouter, createContext },
  })

  void app(server, {})

  server.get('/', async () => {
    return { hello: 'world' }
  })

  const stop = async () => await server.close()
  const start = async () => {
    try {
      await server.listen(port)
      console.log('listening on port', port)
    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }
  }

  return { server, start, stop }
}

const { start } = createServer({
  port: 4002,
})

void start()

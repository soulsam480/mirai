import fp from 'fastify-plugin'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { createContext } from '../rpc/context'
import { appRouter } from '../rpc/routers/_appRouter'

export default fp(async function (server) {
  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext },
  })
})

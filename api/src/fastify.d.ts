import type { SessionUser } from './rpc/context'

declare module 'fastify' {
  interface FastifyRequest {
    session: () => SessionUser | null
  }

  interface FastifyInstance {
    addJobToQueue: typeof import('./queues/boss').addJob
  }
}

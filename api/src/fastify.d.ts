import type { SessionUser } from './rpc/context'

declare module 'fastify' {
  interface FastifyRequest {
    session: () => SessionUser | null
  }

  interface FastifyInstance {
    addJobToQueue: typeof import('@mirai/api/src/queues/boss').addJob
  }
}

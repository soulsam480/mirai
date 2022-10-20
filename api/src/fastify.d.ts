import type { SessionUser } from './rpc/context'

declare module 'fastify' {
  interface FastifyRequest {
    session: () => SessionUser | null
  }
}

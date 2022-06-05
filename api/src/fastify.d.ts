import type { SessionUser } from './rpc/context'

declare module 'fastify' {
  export interface FastifyRequest {
    session: () => SessionUser | null
  }
}

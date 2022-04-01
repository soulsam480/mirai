import { Account } from '@prisma/client'
import * as trpc from '@trpc/server'
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { miraiClient } from '../db'

export interface SessionUser {
  user: Pick<Account, 'email' | 'id' | 'role'>
}

export const createContext = async ({ req, res }: CreateFastifyContextOptions) => {
  // for API-response caching see https://trpc.io/docs/caching

  const session = req.headers.authorization ?? '{}'
  const serializedSession = JSON.parse(session)

  return {
    req,
    res,
    prisma: miraiClient,
    user:
      session !== undefined && Object.keys(serializedSession).length > 0 ? (serializedSession as SessionUser) : null,
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>

import { Account } from '@prisma/client'
import * as trpc from '@trpc/server'
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { miraiClient } from '../db'

export interface SessionUser {
  user: Pick<Account, 'email' | 'id' | 'role'>
}

export const createContext = async ({ req, res }: CreateFastifyContextOptions) => {
  // for API-response caching see https://trpc.io/docs/caching

  const session = req.session()

  return {
    req,
    res,
    prisma: miraiClient,
    session,
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>

import { PrismaClient } from '@prisma/client';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';
import { withExclude } from 'prisma-exclude';

const prisma = withExclude(
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  }),
);
/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({ req, res }: trpcNext.CreateNextContextOptions) => {
  // for API-response caching see https://trpc.io/docs/caching

  const session = await getSession({ req });

  return {
    req,
    res,
    prisma,
    user: session,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

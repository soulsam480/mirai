import { PrismaClient } from '@prisma/client';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';
import { withExclude } from 'prisma-exclude';

export type WithExcludeClient = typeof miraiClient;
class DBClient {
  static client: ReturnType<typeof withExclude>;

  static getClient() {
    if (this.client) return this.client;

    this.client = withExclude(
      new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      }),
    );

    return this.client;
  }
}

export const miraiClient = DBClient.getClient();

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
    prisma: miraiClient,
    user: session,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

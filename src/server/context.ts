import { PrismaClient } from '@prisma/client';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { verify } from 'jsonwebtoken';
import { JwtPayload } from './lib/auth';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({ req, res }: trpcNext.CreateNextContextOptions) => {
  // for API-response caching see https://trpc.io/docs/caching

  function getUserFromHeader() {
    const token = req.cookies['__mirai-sess'];

    if (token) {
      try {
        const user = <JwtPayload>verify(token, process.env.ACCESS_TOKEN_SECRET as string);

        return user || null;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  return {
    req,
    res,
    prisma,
    user: getUserFromHeader(),
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

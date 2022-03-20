import { PrismaClient } from '@prisma/client';
import { withExclude } from 'prisma-exclude';

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

export type WithExcludeClient = typeof miraiClient;

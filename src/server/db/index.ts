import { PrismaClient } from '@prisma/client'
import { withExclude } from 'prisma-exclude'

let clients = 0
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class DBClient {
  static client: ReturnType<typeof withExclude>

  static getClient() {
    if (this.client !== undefined) return this.client

    this.client = withExclude(
      new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      }),
    )

    clients++
    // eslint-disable-next-line no-console
    console.log('clients', clients)

    return this.client
  }
}

export const miraiClient = DBClient.getClient()

export type WithExcludeClient = typeof miraiClient

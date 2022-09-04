import { PrismaClient } from '@prisma/client'
import { withExclude } from 'prisma-exclude'
import { getEnv } from '../lib'

declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof withExclude> | undefined
}

let miraiClient: ReturnType<typeof withExclude>

if (getEnv('NODE_ENV') === 'production') {
  miraiClient = withExclude(
    new PrismaClient({
      log: ['error'],
    }),
  )
} else {
  if (global.prisma === undefined || global.prisma === null) {
    global.prisma = withExclude(
      new PrismaClient({
        log: getEnv('NODE_ENV') === 'development' ? ['query', 'error', 'warn'] : ['error'],
      }),
    )
  }

  miraiClient = global.prisma
}

export { miraiClient }

export type WithExcludeClient = typeof miraiClient

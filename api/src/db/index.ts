import { PrismaClient } from '@prisma/client'
import { withExclude } from 'prisma-exclude'

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof withExclude> | undefined
}

let miraiClient: ReturnType<typeof withExclude>

if (process.env.NODE_ENV === 'production') {
  miraiClient = withExclude(
    new PrismaClient({
      log: ['error'],
    }),
  )
} else {
  if (global.prisma === undefined || global.prisma === null) {
    global.prisma = withExclude(
      new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      }),
    )
  }

  miraiClient = global.prisma
}

export default miraiClient

export { miraiClient }

export type WithExcludeClient = typeof miraiClient

import { FastifyInstance } from 'fastify'
import { logger } from '../lib'

export async function registerRoutes(app: FastifyInstance) {
  // @ts-expect-error bad lib types
  const routes = import.meta.globEager('./*.!(index.ts)')

  Object.entries(routes).forEach(([path, descriptors]) => {
    const { router, prefix } = descriptors

    if (router === undefined)
      return logger.error(`\n [Mirai error] Please export router as [router] from module ${path}. \n`)
    if (typeof router !== 'function')
      return logger.error(`\n [Mirai error] Router export from ${path} is not a function. \n`)

    logger.info(`\n Registering router ${path} with prefix ${(prefix as string) ?? 'nill'} \n`)

    void app.register(router, { prefix })
  })
}

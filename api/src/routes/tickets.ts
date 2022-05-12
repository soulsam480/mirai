import { FastifyPluginAsync } from 'fastify'
import { ticketQueue } from '../queues'

export const router: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.post<{ Body: { data: string } }>('/', async ({ body }) => {
    await ticketQueue.add(body)

    return 'success'
  })
}

export const prefix = '/tickets'

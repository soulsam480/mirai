import { FastifyInstance } from 'fastify'
import * as fastifyAdapter from '@bull-board/fastify'
import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'

import { ticketQueue } from '../queues'

export function setupBull(app: FastifyInstance) {
  const serverAdapter = new fastifyAdapter.FastifyAdapter()
  serverAdapter.setBasePath('/bull')

  createBullBoard({
    serverAdapter,
    queues: [new BullMQAdapter(ticketQueue)],
  })

  void app.register(serverAdapter.registerPlugin(), { basePath: '/', prefix: '/bull' })
}

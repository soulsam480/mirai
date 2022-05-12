import { FastifyInstance } from 'fastify'
import * as fastifyAdapter from '@bull-board/fastify'
import { createBullBoard } from '@bull-board/api'
import { BullAdapter } from '@bull-board/api/bullAdapter'

import { ticketQueue } from '../queues'

export function setupBull(app: FastifyInstance) {
  const serverAdapter = new fastifyAdapter.FastifyAdapter()
  serverAdapter.setBasePath('/bull')

  createBullBoard({
    serverAdapter,
    queues: [new BullAdapter(ticketQueue)],
  })

  void app.register(serverAdapter.registerPlugin(), { basePath: '/', prefix: '/bull' })
}

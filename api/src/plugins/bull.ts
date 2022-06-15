import fp from 'fastify-plugin'
import * as fastifyAdapter from '@bull-board/fastify'
import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { notificationQueue, ticketQueue } from '../queues'

export default fp(async function (app) {
  const serverAdapter = new fastifyAdapter.FastifyAdapter()
  serverAdapter.setBasePath('/bull')

  createBullBoard({
    serverAdapter,
    queues: [new BullMQAdapter(ticketQueue), new BullMQAdapter(notificationQueue)],
  })

  await app.register(serverAdapter.registerPlugin(), { basePath: '/', prefix: '/bull' })
})

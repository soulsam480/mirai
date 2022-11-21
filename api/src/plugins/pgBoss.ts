import fp from 'fastify-plugin'
import { addJob, boss, registerWorkers } from '../queues/boss'

export default fp(async function (fastify) {
  await boss.start()

  await registerWorkers()

  fastify.decorate('addJobToQueue', addJob)

  fastify.addHook('onClose', async () => {
    await boss.stop()
  })
})

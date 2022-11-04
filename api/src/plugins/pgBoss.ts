import fp from 'fastify-plugin'
import { addJob, boss } from '../queues/boss'

export default fp(async function (fastify) {
  await boss.start()

  fastify.decorate('addJobToQueue', addJob)

  fastify.addHook('onClose', async () => {
    await boss.stop()
  })
})

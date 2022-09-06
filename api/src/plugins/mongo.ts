import fp from 'fastify-plugin'
import { createMongoConnection } from '../db'

export default fp(async function (server) {
  const mongo = await createMongoConnection()

  server.addHook('onClose', async () => {
    await mongo.disconnect()
  })
})

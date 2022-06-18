import fp from 'fastify-plugin'
import { createMongoConnection } from '../db'
import { setLogLevel } from '@typegoose/typegoose'

export default fp(async function (server) {
  const mongo = await createMongoConnection()
  setLogLevel('TRACE')

  server.addHook('onClose', async () => {
    await mongo.disconnect()
  })
})

import { FastifyPluginAsync } from 'fastify'
import { setupWsHandlers } from '../ws'

const sockRouter: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', { websocket: true }, (conn) => {
    setupWsHandlers(conn)
  })
}

export default sockRouter

export const autoPrefix = '/sock'

import type { SocketStream } from '@fastify/websocket'
import { TokenExpiredError } from 'jsonwebtoken'
import type { WebSocket } from 'ws'
import { parsePayload, WSPayload } from './parser'
import superjson from 'superjson'
import { authToken, logger } from '../lib'
import { EventMap, mq } from './mq'

interface IClientMeta {
  joinedAt: number
  authenticated: boolean
  subscriptions: string[]
}

const wsClients = new Map<string, IClientMeta>()

export function setupWsHandlers(conn: SocketStream) {
  conn.socket.on('message', function (data) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const dataString = data.toString()

    if (dataString === 'ping') {
      return conn.socket.send('pong')
    }

    const parsedData = parsePayload(dataString)

    if (parsedData?.op !== undefined) {
      handlers[parsedData.op]?.(parsedData.d, conn.socket)
    }
  })
}

// TODO: remove all handlers on auth error
const handlers: Record<string, (data: WSPayload['d'], socket: WebSocket) => void> = {
  auth(data: { token: string }, socket) {
    let userId: number | null = null

    function handler(eventData: EventMap['notification']) {
      if (eventData.id === userId) {
        socket.send(superjson.stringify({ op: 'notification', d: { ts: eventData.ts } }))
      }
    }

    try {
      // auth through token
      const session = authToken.decode(data.token)

      userId = session.user.id

      // notiffy client that auth was successful
      socket.send(superjson.stringify({ op: 'auth-success' }))

      // attach handler for notification from queue
      mq.on('notification', handler)

      const joinedAt = Date.now()

      // we have joinedAt inside key to allow same user to have multiple connections
      wsClients.set(`${session.user.id}-${joinedAt}`, {
        authenticated: true,
        joinedAt,
        subscriptions: ['notification'],
      })
      logger.info(`Connected clients ${wsClients.size}`)

      // remove when client disconnects
      socket.on('close', () => {
        mq.off('notification', handler)

        wsClients.delete(`${session.user.id}-${joinedAt}`)
        logger.info(`Connected clients ${wsClients.size}`)
      })
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        socket.send(superjson.stringify({ op: 'token-expired' }))
      }

      mq.off('notification', handler)
    }
  },
}

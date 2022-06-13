import type { SocketStream } from '@fastify/websocket'
import { TokenExpiredError } from 'jsonwebtoken'
import type { WebSocket } from 'ws'
import { parsePayload, WSPayload } from './parser'
import superjson from 'superjson'
import { authToken, logger } from '../lib'
import { EventMap, notificationEmitter } from './emitter'

let client = 0

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

  conn.socket.once('close', () => client--)
}

// TODO: remove all handlers on auth error
const handlers: Record<string, (data: WSPayload['d'], socket: WebSocket) => void> = {
  auth(data: { token: string }, socket) {
    client++
    logger.info(`Connected clients ${client}`)

    let userId: number | null = null

    function handler(eventData: EventMap['notification']) {
      if (eventData === userId) {
        socket.send(superjson.stringify({ op: 'notification' }))
      }
    }

    try {
      // auth through token
      const session = authToken.decode(data.token)

      userId = session.user.id

      // notiffy client that auth was successful
      socket.send(superjson.stringify({ op: 'auth-success' }))

      // attach handler for notification from queue
      notificationEmitter.on('notification', handler)

      // remove when client disconnects
      socket.on('close', () => notificationEmitter.off('notification', handler))
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        socket.send(superjson.stringify({ op: 'token-expired' }))
      }

      notificationEmitter.off('notification', handler)
    }
  },
}

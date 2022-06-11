import type { SocketStream } from '@fastify/websocket'
import type { WebSocket } from 'ws'
import { parsePayload, WSPayload } from './parser'
import superjson from 'superjson'
import type { SessionUser } from '../rpc/context'
import { logger } from '../lib'

let client = 0

export function setupWsHandlers(conn: SocketStream) {
  conn.socket.on('message', (data) => {
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

const handlers: Record<string, (data: WSPayload['d'], socket: WebSocket) => void> = {
  auth(data: SessionUser, socket) {
    client++

    logger.info(`Connected clients ${client}`)

    if (data.user !== undefined) {
      socket.send(superjson.stringify({ op: 'auth-success' }))
    }
  },
}

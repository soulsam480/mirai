import { SocketStream } from '@fastify/websocket'
import type { WebSocket } from 'ws'
import { parsePayload, WSPayload } from './parser'
import superjson from 'superjson'
import { SessionUser } from '../rpc/context'

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
}

const handlers: Record<string, (data: WSPayload['d'], socket: WebSocket) => void> = {
  auth: (data: SessionUser, socket) => {
    if (data.user !== undefined) {
      socket.send(superjson.stringify({ op: 'auth-success' }))
    }
  },
}

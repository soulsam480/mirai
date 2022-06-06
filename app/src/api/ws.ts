/**
 * referenced from https://github.com/benawad/dogehouse/blob/staging/kebab/src/websocket/raw.ts
 */

import WebSocket from 'isomorphic-ws'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { Session } from 'next-auth'
import superjson from 'superjson'
import { WSPayload } from '@mirai/api'

const heartbeatInterval = 8000
const url = process.env.NEXT_WS_BASE ?? 'ws://localhost:4002/sock'
const connectionTimeout = 15000

export type Opcode = string
export type ListenerHandler<Data = unknown> = (data: Data) => void
export interface Subscriber<Data = unknown> {
  opcode: Opcode
  handler: ListenerHandler<Data>
}

export interface Connection {
  close: () => void
  subscribe: <Data = unknown>(opcode: Opcode, handler: ListenerHandler<Data>) => () => void
  send: (opcode: Opcode, data: unknown) => void
}

export const createWsConn = async (session: Session): Promise<Connection> =>
  await new Promise((resolve, _reject) => {
    const socket = new ReconnectingWebSocket(url, [], {
      connectionTimeout,
      WebSocket,
    })

    const apiSend = (opcode: Opcode, data: unknown) => {
      if (socket.readyState !== socket.OPEN) return

      const raw = superjson.stringify({ op: opcode, d: data })

      socket.send(raw)
    }

    const subscribers: Subscriber[] = []

    socket.addEventListener('close', (error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      if (error.code === 4001) {
        socket.close()
      } else if (error.code === 4003) {
        socket.close()
      } else if (error.code === 4004) {
        socket.close()
      }
    })

    socket.addEventListener('message', (e) => {
      if (e.data === `"pong"` || e.data === `pong`) {
        // eslint-disable-next-line no-console
        console.log('in', 'pong')
        return
      }

      const message = superjson.parse<WSPayload>(e.data)

      if (message.op === 'auth-success') {
        const connection: Connection = {
          close: () => socket.close(),
          subscribe: (opcode, handler) => {
            const subscriber: Subscriber<any> = { opcode, handler }

            subscribers.push(subscriber)

            return () => subscribers.splice(subscribers.indexOf(subscriber), 1)
          },
          send: apiSend,
        }

        resolve(connection)
      } else {
        subscribers.filter(({ opcode }) => opcode === message.op).forEach((it) => it.handler(message.d))
      }
    })

    socket.addEventListener('open', () => {
      const id = setInterval(() => {
        if (socket.readyState === socket.CLOSED) {
          clearInterval(id)
        } else {
          socket.send('ping')
          // eslint-disable-next-line no-console
          console.log('out', 'ping')
        }
      }, heartbeatInterval)

      apiSend('auth', session)
    })
  })

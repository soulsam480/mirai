/**
 * referenced from https://github.com/benawad/dogehouse/blob/staging/kebab/src/websocket/raw.ts
 */

import WebSocket from 'isomorphic-ws'
import ReconnectingWebSocket from 'reconnecting-websocket'
import superjson from 'superjson'
import { WSPayload } from '@mirai/api'

const heartbeatInterval = 8000
const url = process.env.NEXT_WS_BASE ?? 'ws://localhost:4002/sock'
const connectionTimeout = 15000

export type Opcode = WSPayload['op']
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

const EXPIRY_LENGTH = 900000

// in-memory token cache to avoid extra API calls
// valid for 15 mins
let tokenData: {
  token: string
  ts: number
} | null = null

// de dupe clients
// this will prevent creation of unused clients
let socket: ReconnectingWebSocket | null = null

export const createWsConn = async (getToken: () => Promise<string>): Promise<Connection> =>
  await new Promise((resolve, _reject) => {
    // get frim cache or fetch from API
    async function fetchToken() {
      try {
        if (tokenData === null || tokenData.ts + EXPIRY_LENGTH < Date.now()) {
          const token = await getToken()

          tokenData = {
            token,
            // we offset it a bit backwords to accomodate the
            // network latency
            ts: Date.now() - 500,
          }

          return token
        }

        return tokenData.token ?? ''
      } catch (error) {
        return ''
      }
    }

    if (socket !== null) {
      socket.close()
      socket = null
    }

    socket = new ReconnectingWebSocket(url, [], {
      connectionTimeout,
      WebSocket,
      maxRetries: 10,
    })

    const apiSend = (opcode: Opcode, data: unknown) => {
      if (socket?.readyState !== socket?.OPEN) return

      const raw = superjson.stringify({ op: opcode, d: data })

      socket?.send(raw)
    }

    const subscribers: Subscriber[] = []

    socket?.addEventListener('close', (error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      if (error.code === 4001) {
        socket?.close()
        tokenData = null
        socket = null
      } else if (error.code === 4003) {
        socket?.close()
        socket = null
      } else if (error.code === 4004) {
        socket?.close()
        tokenData = null
        socket = null
      }
    })

    socket?.addEventListener('message', (e) => {
      if (e.data === `"pong"` || e.data === `pong`) {
        // eslint-disable-next-line no-console
        console.log('pong')
        return
      }

      const message = superjson.parse<WSPayload>(e.data)

      if (message.op === 'auth-success') {
        console.log('logged in')

        const connection: Connection = {
          close: () => socket?.close(),
          subscribe: (opcode, handler) => {
            const subscriber: Subscriber<any> = { opcode, handler }

            subscribers.push(subscriber)

            return () => subscribers.splice(subscribers.indexOf(subscriber), 1)
          },
          send: apiSend,
        }

        resolve(connection)

        return
      }

      // get a new token on expiry and reconnect
      if (message.op === 'token-expired') {
        void fetchToken().then((token) => apiSend('auth', { token }))

        return
      }

      subscribers.filter(({ opcode }) => opcode === message.op).forEach((it) => it.handler(message.d))
    })

    socket?.addEventListener('open', () => {
      const id = setInterval(() => {
        if (socket?.readyState === socket?.CLOSED) {
          clearInterval(id)
        } else {
          socket?.send('ping')
          // eslint-disable-next-line no-console
          console.log('ping')
        }
      }, heartbeatInterval)

      void fetchToken().then((token) => apiSend('auth', { token }))
    })
  })

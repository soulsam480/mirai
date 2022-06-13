import superjson from 'superjson'

export interface WSPayload<T = any> {
  op: 'auth' | 'auth-success' | 'token-expired' | 'notification'
  d: T
}

export function parsePayload<T = any>(data: string) {
  const parsed = superjson.parse<WSPayload<T>>(data)

  return parsed
}

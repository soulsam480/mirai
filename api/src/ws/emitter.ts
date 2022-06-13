import mitt from 'mitt'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type EventMap = {
  notification: number
}

export const notificationEmitter = mitt<EventMap>()

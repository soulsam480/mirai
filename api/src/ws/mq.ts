import mitt from 'mitt'
import { NotificationPayload } from '../types'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type EventMap = {
  notification: NotificationPayload
}

export const mq = mitt<EventMap>()

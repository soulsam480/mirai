import { Queue, Worker } from 'bullmq'
import { notification, Notification } from '../entities'
import { getEnv } from '../lib'
import { wsEventEmitter } from '../ws'

export const notificationQueue = new Queue<Notification>('notifications', {
  connection: {
    port: parseInt(getEnv('REDIS_PORT') as string),
  },
})

const _worker = new Worker<Notification>(
  'notifications',
  async (job) => {
    const { data } = job

    await notification.create(data)

    wsEventEmitter.emit('notification', {
      id: data.ownerId,
      ts: Date.now(),
    })

    return 'OK'
  },
  {
    limiter: { max: 1000, duration: 5000 },
    connection: {
      port: parseInt(getEnv('REDIS_PORT') as string),
    },
  },
)

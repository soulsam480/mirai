import { Queue, Worker } from 'bullmq'
import { Notification } from '../entities'

export const notificationQueue = new Queue<Notification>('notifications', {
  connection: {
    port: parseInt(process.env.REDIS_PORT),
  },
})

const _worker = new Worker<Notification>(
  'notifications',
  async () => {
    //

    return 'OK'
  },
  {
    limiter: { max: 1000, duration: 5000 },
    connection: {
      port: parseInt(process.env.REDIS_PORT),
    },
  },
)

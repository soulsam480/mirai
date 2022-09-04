import { Queue, Worker } from 'bullmq'
import { SourceType } from '../entities'
import { getEnv } from '../lib'
import { notificationQueue } from './notifications'

interface TicketBatchData {
  instituteId: number
  size: number
}

export const ticketBatchQueue = new Queue<TicketBatchData>('ticketBatch', {
  connection: {
    port: parseInt(getEnv('REDIS_PORT') as string),
  },
})

const _worker = new Worker<TicketBatchData>(
  'ticketBatch',
  async (job) => {
    const { data } = job

    await notificationQueue.add(`notification-${Date.now()}`, {
      ownerId: data.instituteId,
      data: {
        sourceType: SourceType.system,
        meta: {
          type: 'ticketBatch',
          size: data.size,
        },
      },
    })
  },
  {
    limiter: { max: 1000, duration: 5000 },
    connection: {
      port: parseInt(getEnv('REDIS_PORT') as string),
    },
  },
)

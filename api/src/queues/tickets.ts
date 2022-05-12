import Queue from 'bull'
import { logger } from '../lib'

export const ticketQueue = Queue<{ data: string }>('tickets', process.env.REDIS_PORT, {
  limiter: { max: 1000, duration: 5000 },
})

void ticketQueue.process((job) => {
  logger.info('processing job', job.data)

  return 'done'
})

ticketQueue.on('completed', async (job, result) => {
  logger.info('job done', result)

  if (await job.isCompleted()) void job.remove()
})

import { createTicketSchema, studentOnboardingSchema } from '@mirai/app'
import Queue from 'bull'
import { z } from 'zod'
import miraiClient from '../db'
import { logger } from '../lib'
import { OverWrite, TicketJob } from '../types'

export const ticketQueue = Queue<TicketJob>('tickets', process.env.REDIS_PORT, {
  limiter: { max: 1000, duration: 5000 },
})

type StudentTicketShape = OverWrite<
  z.infer<typeof createTicketSchema>['meta'],
  { data: z.infer<typeof studentOnboardingSchema> }
>

void ticketQueue.process(async (job) => {
  // logger.info('processing job', job.data)

  const ticket = await miraiClient.ticket.findFirst({ where: { id: job.data.id } })

  if (ticket === null) return 'invalid ticket'

  const meta = ticket.meta as StudentTicketShape

  if (meta.type !== 'STUDENT_ONBOARDING') return 'non-student ticket'

  // TODO: create student, account and link them
})

ticketQueue.on('completed', async (job, result) => {
  logger.info('job done', result)

  // if (await job.isCompleted()) void job.remove()
})

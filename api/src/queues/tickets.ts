import { createTicketSchema, studentOnboardingSchema } from '@mirai/app'
import Queue from 'bull'
import { z } from 'zod'
import miraiClient from '../db'
import { createStudent, logger } from '../lib'
import { OverWrite, TicketJob } from '../types'

export const ticketQueue = Queue<TicketJob>('tickets', process.env.REDIS_PORT, {
  limiter: { max: 1000, duration: 5000 },
})

type StudentTicketShape = OverWrite<
  z.infer<typeof createTicketSchema>['meta'],
  { data: z.infer<typeof studentOnboardingSchema> }
>

void ticketQueue.process(async (job) => {
  const ticket = await miraiClient.ticket.findFirst({ where: { id: job.data.id } })

  if (ticket === null)
    return {
      success: false,
      message: "Ticket doesn't exist",
    }

  const meta = ticket.meta as StudentTicketShape

  // here we'll probably handle different tickets with early return if blocks
  if (meta.type !== 'STUDENT_ONBOARDING')
    return {
      success: false,
      message: 'non-student ticket',
    }

  try {
    const createResult = await createStudent({ ...meta.data, instituteId: ticket.instituteId })

    return createResult
  } catch (error) {
    return {
      success: false,
      message: error.toString(),
    }
  }
})

ticketQueue.on('completed', async (job, result) => {
  logger.info('job done', JSON.stringify(result))

  // if (await job.isCompleted()) void job.remove()
})

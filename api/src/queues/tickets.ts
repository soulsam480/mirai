import { createTicketSchema, studentOnboardingSchema } from '@mirai/app'
import type { TicketStatus } from '@prisma/client'
import { Queue, Worker } from 'bullmq'
import { z } from 'zod'
import miraiClient from '../db'
import { createStudent } from '../lib'
import { OverWrite, TicketJob } from '../types'

export const ticketQueue = new Queue<TicketJob>('tickets', {
  connection: {
    port: parseInt(process.env.REDIS_PORT),
  },
})

type StudentTicketShape = OverWrite<
  z.infer<typeof createTicketSchema>['meta'],
  { data: z.infer<typeof studentOnboardingSchema> }
>

function isDup(current: TicketStatus, incoming: TicketStatus) {
  const blocked = ['RESOLVED', 'CLOSED']

  // same status is dup
  if (current === incoming) return true

  // if res or closed, shouln't update
  if (blocked.includes(current)) return true

  // here current can be updated irrespective of the incoming
  return false
}

const _worker = new Worker<TicketJob>(
  'tickets',
  async (job) => {
    const ticket = await miraiClient.ticket.findFirst({
      where: { id: job.data.id },
      include: { institute: { select: { name: true } } },
    })

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

    const { id: ticketId, status: incomingStatus, notes } = job.data

    // second level check. When same status, avoid processing again
    if (isDup(ticket.status, incomingStatus)) {
      return {
        success: true,
        message: 'Duplicate ticket review',
      }
    }

    if (incomingStatus !== 'RESOLVED') {
      await miraiClient.ticket.update({
        where: { id: ticketId },
        data: {
          status: incomingStatus,
          notes,
          closedAt: incomingStatus === 'CLOSED' ? new Date().toISOString() : null,
          closedBy: incomingStatus === 'CLOSED' ? ticket.institute.name ?? 'Institute admin' : null,
        },
      })

      return {
        success: true,
        message: `Ticket handled with status ${incomingStatus}`,
      }
    }

    try {
      const createResult = await createStudent({ ...meta.data, instituteId: ticket.instituteId })

      // resolve the ticket
      await miraiClient.ticket.update({ where: { id: ticketId }, data: { status: incomingStatus, notes } })

      return createResult
    } catch (error) {
      return {
        success: false,
        message: error.toString(),
      }
    }
  },
  {
    limiter: { max: 1000, duration: 5000 },
  },
)

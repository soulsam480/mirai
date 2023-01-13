import { Job } from 'pg-boss'
import { addJob, Jobs } from './boss'

export interface TicketBatchData {
  instituteId: number
  size: number
}

export async function ticketBatchWorker(job: Job<Jobs['TICKET_BATCH']>) {
  const { data } = job

  await addJob('NOTIFICATION', {
    ownerId: data.instituteId,
    data: {
      sourceType: 'system',
      meta: {
        type: 'TICKET_BATCH',
        size: data.size,
      },
    },
  })
}

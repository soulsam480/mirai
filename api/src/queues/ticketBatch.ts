import { SourceType } from '../entities'
import { addJob, boss, JobNames } from './boss'

export interface TicketBatchData {
  instituteId: number
  size: number
}

// TODO: move to pub-sub system
void boss.work<TicketBatchData, any>('TICKET_BATCH' as JobNames, async (job) => {
  const { data } = job

  await addJob('NOTIFICATION', {
    ownerId: data.instituteId,
    data: {
      sourceType: SourceType.system,
      meta: {
        type: 'ticketBatch',
        size: data.size,
      },
    },
  })
})

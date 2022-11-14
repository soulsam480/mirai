import PgBoss from 'pg-boss'
import { getEnv } from '../lib'
import { TicketJob } from '../types'
import { CreateNotificationPayload } from './notifications'
import { TicketBatchData } from './ticketBatch'

export const boss = new PgBoss(getEnv('PGBOSS_DB_URL') as string)

interface Jobs {
  TICKET: TicketJob
  TICKET_BATCH: TicketBatchData
  NOTIFICATION: CreateNotificationPayload
}

export type JobNames = keyof Jobs

export async function addJob<T extends JobNames>(name: T, data: Jobs[T]) {
  return await boss.send(name, data)
}

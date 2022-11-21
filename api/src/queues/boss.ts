import { notificationDataSchema } from '@mirai/schema'
import PgBoss from 'pg-boss'
import { getEnv } from '../lib'
import { TicketJob } from '../types'
import { dataDiffWorker } from './dataDiff'
import { CreateNotificationPayload, notificationWorker } from './notifications'
import { TicketBatchData, ticketBatchWorker } from './ticketBatch'
import { ticketWorker } from './tickets'

export const boss = new PgBoss(getEnv('PGBOSS_DB_URL') as string)

export interface Jobs {
  TICKET: TicketJob
  TICKET_BATCH: TicketBatchData
  NOTIFICATION: CreateNotificationPayload
  STUDENT_DATA_DIFF: any
}

export type JobNames = keyof Jobs

export async function addJob<T extends JobNames>(name: T, data: Jobs[T]) {
  if (name === 'NOTIFICATION') {
    await notificationDataSchema.parseAsync(data.data)
  }

  return await boss.send(name, data)
}

export async function registerWorkers() {
  await boss.schedule('STUDENT_DATA_DIFF' as JobNames, '*/5 * * * *')

  await boss.work('TICKET' as JobNames, ticketWorker)
  await boss.work('STUDENT_DATA_DIFF' as JobNames, dataDiffWorker)

  // TODO: move to pub-sub system
  await boss.work('NOTIFICATION' as JobNames, notificationWorker)

  // TODO: move to pub-sub system
  await boss.work('TICKET_BATCH' as JobNames, ticketBatchWorker)
}

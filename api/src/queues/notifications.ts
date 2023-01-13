import { notificationDataSchema } from '@mirai/schema'
import { Job } from 'pg-boss'
import { z } from 'zod'
import miraiClient from '../db'
import { mq } from '../ws'
import { Jobs } from './boss'

export interface CreateNotificationPayload {
  ownerId: number
  data: z.infer<typeof notificationDataSchema>
}

export async function notificationWorker(job: Job<Jobs['NOTIFICATION']>) {
  const { data } = job

  await miraiClient.notification.create({
    data,
  })

  mq.emit('notification', {
    id: data.ownerId,
    ts: Date.now(),
  })

  return 'OK'
}

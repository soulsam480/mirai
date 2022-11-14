import miraiClient from '../db'
import { mq } from '../ws'
import { boss } from './boss'

export interface CreateNotificationPayload {
  ownerId: number
  data: Record<string, any>
}

// TODO: move to pub-sub system
void boss.work<CreateNotificationPayload, any>('some', async (job) => {
  const { data } = job

  await miraiClient.notification.create({
    data,
  })

  mq.emit('notification', {
    id: data.ownerId,
    ts: Date.now(),
  })

  return 'OK'
})

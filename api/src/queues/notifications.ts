import { notification, Notification } from '../entities'
import { mq } from '../ws'
import { boss } from './boss'

// TODO: move to pub-sub system
void boss.work<Notification, any>('some', async (job) => {
  const { data } = job

  await notification.create(data)

  mq.emit('notification', {
    id: data.ownerId,
    ts: Date.now(),
  })

  return 'OK'
})

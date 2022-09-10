import { HydratedDocument } from 'mongoose'
import { z } from 'zod'
import { notification, Notification } from '../../entities'
import { trpc } from '../trpc'

export const notificationRouter = trpc.router({
  get_all: trpc.procedure
    .input(
      z.object({
        ts: z.number().optional(),
      }),
    )
    .query(async ({ input: { ts } }) => {
      let data

      if (ts !== undefined) {
        const decrypedDate = new Date(ts * 1000)

        data = await notification
          .find({
            createdAt: {
              $lt: new Date(decrypedDate),
            },
          })
          .populate('data')
          .sort({ createdAt: -1 })
          .limit(6)
      } else {
        data = await notification.find().populate('data').sort({ createdAt: -1 }).limit(6)
      }

      const hasMore = data.length === 6
      let nextCursor = null

      if (hasMore) {
        const nextCursorRecord = data[5]

        const unixTimestamp = Math.floor((nextCursorRecord?.createdAt?.getTime() ?? 0) / 1000)

        nextCursor = unixTimestamp.toString()

        data.pop()
      }

      return {
        data: data as Array<HydratedDocument<Notification>>,
        hasMore,
        nextCursor,
      }
    }),
})

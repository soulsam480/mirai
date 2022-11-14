import { z } from 'zod'
import miraiClient from '../../db'
import { createRouter } from '../createRouter'

export const notificationRouter = createRouter().query('get_all', {
  input: z.object({
    cursor: z.number().optional(),
    take: z.number().optional(),
  }),
  async resolve({ input: { cursor, take = 25 } }) {
    const results = await miraiClient.notification.findMany({
      take,
      orderBy: {
        id: 'asc',
      },
      ...(cursor !== undefined ? { cursor: { id: cursor }, skip: 1 } : {}),
    })

    return {
      data: results,
      hasMore: results.length === take,
      nextCursor: results.at(-1)?.id,
    }
  },
})

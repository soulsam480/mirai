import { createRouter } from '../../createRouter'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { semUpdateSchema } from '@mirai/app'

export const scoreRouter = createRouter()
  .query('get', {
    input: z.number(),
    async resolve({ ctx, input }) {
      const scoreDetails = await ctx.prisma.studentScore.findFirst({
        where: { studentId: input },
      })

      if (scoreDetails === null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Student score details not found !',
        })
      }

      return scoreDetails
    },
  })
  .mutation('update_score_card', {
    input: z.object({ studentId: z.number(), data: z.record(semUpdateSchema) }),
    async resolve({ ctx, input: { data, studentId } }) {
      const scoreData = await ctx.prisma.studentScore.update({
        where: { studentId },
        data: {
          scores: data,
        },
      })

      return scoreData
    },
  })

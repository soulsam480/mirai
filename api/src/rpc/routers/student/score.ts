import { createRouter } from '../../createRouter'
import { z } from 'zod'
import { createStudentScoreSchema } from '@mirai/app'
import { TRPCError } from '@trpc/server'

export const scoreRouter = createRouter()
  .mutation('manage', {
    input: createStudentScoreSchema,
    async resolve({ ctx, input }) {
      const { studentId, ...data } = input

      const result = await ctx.prisma.studentScore.upsert({
        where: { studentId },
        create: input,
        update: data,
      })

      return result
    },
  })
  .mutation('remove', {
    input: z.number(),
    async resolve({ ctx, input }) {
      try {
        await ctx.prisma.studentScore.delete({ where: { id: input } })
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unable to delete score' })
      }
    },
  })
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

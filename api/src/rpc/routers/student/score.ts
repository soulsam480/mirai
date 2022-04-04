import { createRouter } from '../../createRouter'
import { z } from 'zod'
import { createStudentScoreSchema } from '@mirai/app'
import { TRPCError } from '@trpc/server'

export const scoreRouter = createRouter()
  .query('get', {
    input: z.number(),
    async resolve({ ctx, input }) {
      const studentScores = await ctx.prisma.studentScore.findFirst({
        where: { studentId: input },
      })

      if (studentScores === null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Student scores not found !',
        })
      }
      return studentScores
    },
  })
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

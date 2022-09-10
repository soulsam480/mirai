import { trpc } from '../../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { semUpdateSchema } from '@mirai/app'
import { procedureWithStudent } from '../../procedures'

export const scoreRouter = trpc.router({
  get: procedureWithStudent.input(z.number()).query(async ({ ctx, input }) => {
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
  }),

  update_score_card: procedureWithStudent
    .input(z.object({ studentId: z.number(), data: z.record(semUpdateSchema) }))
    .mutation(async ({ ctx, input: { data, studentId } }) => {
      const scoreData = await ctx.prisma.studentScore.update({
        where: { studentId },
        data: {
          scores: data,
        },
      })

      return scoreData
    }),
})

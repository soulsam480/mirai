import { createRouter } from '../../createRouter'
import { z } from 'zod'
import { createStudentBasicsSchema } from '@mirai/schema'
import { TRPCError } from '@trpc/server'

export const basicsRouter = createRouter()
  .query('get', {
    input: z.number(),
    async resolve({ ctx, input }) {
      const studentBasics = await ctx.prisma.studentBasics.findFirst({
        where: { studentId: input },
      })

      if (studentBasics === null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Student basics not found !',
        })
      }

      return studentBasics
    },
  })
  .mutation('manage', {
    input: createStudentBasicsSchema,
    async resolve({ ctx, input }) {
      const { studentId, ...data } = input
      const result = await ctx.prisma.studentBasics.upsert({
        where: { studentId },
        create: input,
        update: data,
      })

      return result
    },
  })

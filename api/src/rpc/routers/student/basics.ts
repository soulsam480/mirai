import { trpc } from '../../trpc'
import { z } from 'zod'
import { createStudentBasicsSchema } from '@mirai/app'
import { TRPCError } from '@trpc/server'
import { procedureWithStudent } from '../../procedures'

export const basicsRouter = trpc.router({
  get: procedureWithStudent.input(z.number()).query(async ({ ctx, input }) => {
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
  }),

  manage: procedureWithStudent.input(createStudentBasicsSchema).mutation(async ({ ctx, input }) => {
    const { studentId, ...data } = input

    const result = await ctx.prisma.studentBasics.upsert({
      where: { studentId },
      create: input,
      update: data,
    })

    return result
  }),
})

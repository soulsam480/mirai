import { createStudentEducationSchema } from '@mirai/app'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { procedureWithStudent } from '../../procedures'
import { trpc } from '../../trpc'

export const educationRouter = trpc.router({
  create: procedureWithStudent.input(createStudentEducationSchema).mutation(async ({ ctx, input }) => {
    const result = await ctx.prisma.studentEducation.createMany({
      data: input,
    })

    return result
  }),

  update: procedureWithStudent
    .input(createStudentEducationSchema.omit({ studentId: true }).partial().extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      const result = await ctx.prisma.studentEducation.update({
        where: { id },
        data,
      })

      return result
    }),

  remove: procedureWithStudent.input(z.number()).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.studentEducation.delete({ where: { id: input } })
    } catch (error) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unable to delete experience' })
    }
  }),

  get_all: procedureWithStudent.input(z.number()).query(async ({ ctx, input }) => {
    const educationDetails = await ctx.prisma.studentEducation.findMany({
      where: { studentId: input },
    })

    if (educationDetails === null) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Student education details not found !',
      })
    }
    return educationDetails
  }),
})

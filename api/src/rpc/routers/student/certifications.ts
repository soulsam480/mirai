import { createCertificationSchema } from '@mirai/app'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { procedureWithStudent } from '../../procedures'
import { trpc } from '../../trpc'

export const certificationRouter = trpc.router({
  create: procedureWithStudent.input(createCertificationSchema).mutation(async ({ ctx, input }) => {
    const certificationData = await ctx.prisma.studentCertification.create({
      data: {
        ...input,
      },
    })

    return certificationData
  }),

  update: procedureWithStudent
    .input(createCertificationSchema.omit({ studentId: true }).partial().extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      const certificationData = await ctx.prisma.studentCertification.update({
        where: { id },
        data: {
          ...data,
        },
      })

      return certificationData
    }),

  remove: procedureWithStudent.input(z.number()).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.studentCertification.delete({ where: { id: input } })
    } catch (error) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unable to delete certification' })
    }
  }),

  get_all: procedureWithStudent.input(z.number()).query(async ({ ctx, input }) => {
    const certifications = await ctx.prisma.studentCertification.findMany({
      where: { studentId: input },
    })

    return certifications
  }),
})

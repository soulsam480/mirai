import { createCertificationSchema } from '@mirai/schema'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createRouter } from '../../createRouter'

export const certificationRouter = createRouter()
  .mutation('create', {
    input: createCertificationSchema,
    async resolve({ ctx, input }) {
      const certificationData = await ctx.prisma.studentCertification.create({
        data: {
          ...input,
        },
      })

      await ctx.prisma.student.update({
        where: { id: certificationData.studentId },
        data: { dataUpdatedAt: new Date() },
      })

      return certificationData
    },
  })
  .mutation('update', {
    input: createCertificationSchema.omit({ studentId: true }).partial().extend({ id: z.number() }),
    async resolve({ ctx, input }) {
      const { id, ...data } = input

      const certificationData = await ctx.prisma.studentCertification.update({
        where: { id },
        data: {
          ...data,
        },
      })

      await ctx.prisma.student.update({
        where: { id: certificationData.studentId },
        data: { dataUpdatedAt: new Date() },
      })

      return certificationData
    },
  })
  .mutation('remove', {
    input: z.number(),
    async resolve({ ctx, input }) {
      try {
        await ctx.prisma.studentCertification.delete({ where: { id: input } })
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unable to delete certification' })
      }
    },
  })
  .query('get_all', {
    input: z.number(),
    async resolve({ ctx, input }) {
      const certifications = await ctx.prisma.studentCertification.findMany({
        where: { studentId: input },
      })

      return certifications
    },
  })

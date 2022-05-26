import { createStudentEducationSchema } from '@mirai/app'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createRouter } from '../../createRouter'

export const educationRouter = createRouter()
  .mutation('create', {
    input: createStudentEducationSchema,
    async resolve({ ctx, input }) {
      const result = await ctx.prisma.studentEducation.createMany({
        data: input,
      })

      return result
    },
  })
  .mutation('update', {
    input: createStudentEducationSchema.omit({ studentId: true }).partial().extend({ id: z.number() }),
    async resolve({ ctx, input }) {
      const { id, ...data } = input
      const result = await ctx.prisma.studentEducation.update({
        where: { id },
        data,
      })

      return result
    },
  })
  .mutation('remove', {
    input: z.number(),
    async resolve({ ctx, input }) {
      try {
        await ctx.prisma.studentEducation.delete({ where: { id: input } })
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unable to delete experience' })
      }
    },
  })
  .query('get_all', {
    input: z.number(),
    async resolve({ ctx, input }) {
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
    },
  })

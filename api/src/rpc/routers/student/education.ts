import { createStudentEducationSchema } from '@mirai/app'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createRouter } from '../../createRouter'

export const educationRouter = createRouter()
  .query('get', {
    input: z.number(),
    async resolve({ ctx, input }) {
      const educationDetails = await ctx.prisma.studentEducation.findFirst({
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
  .mutation('manage', {
    input: createStudentEducationSchema,
    async resolve({ ctx, input }) {
      const { studentId, ...data } = input

      const result = await ctx.prisma.studentEducation.upsert({
        where: { id: studentId }, // todo: id should be studentId
        create: input,
        update: data,
      })

      return result
    },
  })

import { createExperienceSchema } from '@mirai/schema'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createRouter } from '../../createRouter'

export const experienceRouter = createRouter()
  .mutation('create', {
    input: createExperienceSchema,
    async resolve({ ctx, input }) {
      const experienceData = await ctx.prisma.studentWorkExperience.create({
        data: {
          ...input,
        },
      })

      return experienceData
    },
  })
  .mutation('update', {
    input: createExperienceSchema.omit({ studentId: true }).partial().extend({ id: z.number() }),
    async resolve({ ctx, input }) {
      const { id, ...data } = input

      const experienceData = await ctx.prisma.studentWorkExperience.update({
        where: { id },
        data: {
          ...data,
        },
      })

      return experienceData
    },
  })
  .mutation('remove', {
    input: z.number(),
    async resolve({ ctx, input }) {
      try {
        await ctx.prisma.studentWorkExperience.delete({ where: { id: input } })
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unable to delete experience' })
      }
    },
  })
  .query('get_all', {
    input: z.number(),
    async resolve({ ctx, input }) {
      const experiences = await ctx.prisma.studentWorkExperience.findMany({
        where: { studentId: input },
        orderBy: {
          startedAt: 'desc',
        },
      })

      return experiences
    },
  })

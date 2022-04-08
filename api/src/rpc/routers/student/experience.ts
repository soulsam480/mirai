import { createExperienceSchema } from '@mirai/app'
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
    input: createExperienceSchema.omit({ studentId: true }).extend({ id: z.number() }),
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

import { createExperienceSchema } from '@mirai/app'
import { z } from 'zod'
import { createRouter } from '../../createRouter'
import dayjs from 'dayjs'

// ! We have to manually serialize the date for now untill we find a better way to do so

export const experienceRouter = createRouter()
  .mutation('create', {
    input: createExperienceSchema,
    async resolve({ ctx, input }) {
      let { endedAt, startedAt, ...rest } = input

      endedAt = endedAt !== undefined && endedAt !== '' ? dayjs(endedAt).toISOString() : undefined
      startedAt = startedAt !== '' ? dayjs(startedAt).toISOString() : startedAt

      const experienceData = await ctx.prisma.studentWorkExperience.create({
        data: {
          ...rest,
          endedAt,
          startedAt,
        },
      })

      return experienceData
    },
  })
  .mutation('update', {
    input: createExperienceSchema.omit({ studentId: true }).extend({ id: z.number() }),
    async resolve({ ctx, input }) {
      let { id, endedAt, startedAt, ...data } = input

      endedAt = endedAt !== undefined && endedAt !== '' ? dayjs(endedAt).toISOString() : undefined
      startedAt = startedAt !== '' ? dayjs(startedAt).toISOString() : startedAt

      const experienceData = await ctx.prisma.studentWorkExperience.update({
        where: { id },
        data: {
          ...data,
          startedAt,
          endedAt,
        },
      })

      return experienceData
    },
  })

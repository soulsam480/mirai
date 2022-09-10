import { createExperienceSchema } from '@mirai/app'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { procedureWithStudent } from '../../procedures'
import { trpc } from '../../trpc'

export const experienceRouter = trpc.router({
  create: procedureWithStudent.input(createExperienceSchema).mutation(async ({ ctx, input }) => {
    const experienceData = await ctx.prisma.studentWorkExperience.create({
      data: {
        ...input,
      },
    })

    return experienceData
  }),

  update: procedureWithStudent
    .input(createExperienceSchema.omit({ studentId: true }).partial().extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      const experienceData = await ctx.prisma.studentWorkExperience.update({
        where: { id },
        data: {
          ...data,
        },
      })

      return experienceData
    }),

  remove: procedureWithStudent.input(z.number()).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.studentWorkExperience.delete({ where: { id: input } })
    } catch (error) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unable to delete experience' })
    }
  }),

  get_all: procedureWithStudent.input(z.number()).query(async ({ ctx, input }) => {
    const experiences = await ctx.prisma.studentWorkExperience.findMany({
      where: { studentId: input },
      orderBy: {
        startedAt: 'desc',
      },
    })

    return experiences
  }),
})

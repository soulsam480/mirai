import { createProjectSchema } from '@mirai/app'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { procedureWithStudent } from '../../procedures'
import { trpc } from '../../trpc'

export const projectRouter = trpc.router({
  create: procedureWithStudent.input(createProjectSchema).mutation(async ({ ctx, input }) => {
    const projectData = await ctx.prisma.studentProject.create({
      data: {
        ...input,
      },
    })

    return projectData
  }),

  update: procedureWithStudent
    .input(createProjectSchema.omit({ studentId: true }).partial().extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      const projectData = await ctx.prisma.studentProject.update({
        where: { id },
        data: {
          ...data,
        },
      })

      return projectData
    }),

  remove: procedureWithStudent.input(z.number()).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.studentProject.delete({ where: { id: input } })
    } catch (error) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unable to delete project' })
    }
  }),

  get_all: procedureWithStudent.input(z.number()).query(async ({ ctx, input }) => {
    const projects = await ctx.prisma.studentProject.findMany({
      where: { studentId: input },
      orderBy: {
        startedAt: 'desc',
      },
    })

    return projects
  }),
})

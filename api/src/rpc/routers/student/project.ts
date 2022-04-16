import { createProjectSchema } from '@mirai/app'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createRouter } from '../../createRouter'

export const projectRouter = createRouter()
  .mutation('create', {
    input: createProjectSchema,
    async resolve({ ctx, input }) {
      const projectData = await ctx.prisma.studentProject.create({
        data: {
          ...input,
        },
      })

      return projectData
    },
  })
  .mutation('update', {
    input: createProjectSchema.omit({ studentId: true }).partial().extend({ id: z.number() }),
    async resolve({ ctx, input }) {
      const { id, ...data } = input

      const projectData = await ctx.prisma.studentProject.update({
        where: { id },
        data: {
          ...data,
        },
      })

      return projectData
    },
  })
  .mutation('remove', {
    input: z.number(),
    async resolve({ ctx, input }) {
      try {
        await ctx.prisma.studentProject.delete({ where: { id: input } })
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unable to delete project' })
      }
    },
  })
  .query('get_all', {
    input: z.number(),
    async resolve({ ctx, input }) {
      const projects = await ctx.prisma.studentProject.findMany({
        where: { studentId: input },
        orderBy: {
          startedAt: 'desc',
        },
      })

      return projects
    },
  })

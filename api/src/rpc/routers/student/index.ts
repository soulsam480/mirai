import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createRouter } from '../../createRouter'
import { experienceRouter } from './experience'

export const studentRouter = createRouter()
  // TODO: add logic for student-student queries, where a student shouldn't be
  // able to query another
  .middleware(async ({ ctx, next }) => {
    if (ctx.user === null)
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      })

    const nextCtx = await next({
      ctx: { ...ctx, user: ctx.user },
    })

    return nextCtx
  })
  .query('get', {
    input: z.number(),
    async resolve({ ctx, input }) {
      const studentData = await ctx.prisma.student.findFirst({
        where: { id: input },
        include: {
          basics: true,
          certifications: true,
          education: true,
          experience: {
            orderBy: {
              startedAt: 'desc',
            },
          },
          projects: true,
          score: true,
        },
      })

      return studentData
    },
  })
  .merge('experience.', experienceRouter)

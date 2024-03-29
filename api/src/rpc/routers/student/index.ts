import { basicsRouter } from './basics'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createRouter } from '../../createRouter'
import { certificationRouter } from './certifications'
import { experienceRouter } from './experience'
import { scoreRouter } from './score'
import { educationRouter } from './education'
import { projectRouter } from './project'

export const studentRouter = createRouter()
  // TODO: add logic for student-student queries, where a student shouldn't be
  // able to query another
  .middleware(async ({ ctx, next }) => {
    if (ctx.session === null)
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      })

    const nextCtx = await next({
      ctx: { ...ctx, user: ctx.session },
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
          course: {
            select: {
              branchName: true,
              programName: true,
              programDuration: true,
              scoreType: true,
            },
          },
          Batch: {
            select: {
              name: true,
              startsAt: true,
              endsAt: true,
            },
          },
          Department: {
            select: {
              name: true,
            },
          },
          institute: {
            select: {
              name: true,
            },
          },
        },
      })

      return studentData
    },
  })
  .merge('basics.', basicsRouter)
  .merge('score.', scoreRouter)
  .merge('education.', educationRouter)
  .merge('experience.', experienceRouter)
  .merge('project.', projectRouter)
  .merge('certification.', certificationRouter)

  .mutation('skills.update', {
    input: z.object({
      studentId: z.number(),
      skills: z.array(z.any()),
    }),
    async resolve({ ctx, input: { skills, studentId } }) {
      const skillData = await ctx.prisma.student.update({
        where: { id: studentId },
        data: { skills },
        select: { skills: true },
      })

      await ctx.prisma.student.update({
        where: { id: studentId },
        data: { dataUpdatedAt: new Date() },
      })

      return skillData
    },
  })

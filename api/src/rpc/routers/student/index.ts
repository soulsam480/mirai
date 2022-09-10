import { z } from 'zod'
import { basicsRouter } from './basics'
import { trpc } from '../../trpc'
import { certificationRouter } from './certifications'
import { experienceRouter } from './experience'
import { scoreRouter } from './score'
import { educationRouter } from './education'
import { projectRouter } from './project'
import { procedureWithStudent } from '../../procedures'

export const studentRouter = trpc.router({
  get: procedureWithStudent.input(z.number()).query(async ({ ctx, input }) => {
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
  }),

  basics: basicsRouter,
  score: scoreRouter,
  education: educationRouter,
  experience: experienceRouter,
  project: projectRouter,
  certification: certificationRouter,
  skills: trpc.router({
    update: procedureWithStudent
      .input(
        z.object({
          studentId: z.number(),
          skills: z.array(z.any()),
        }),
      )
      .mutation(async ({ ctx, input: { skills, studentId } }) => {
        const skillData = await ctx.prisma.student.update({
          where: { id: studentId },
          data: { skills },
          select: { skills: true },
        })

        return skillData
      }),
  }),
})

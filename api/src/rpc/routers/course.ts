import { TRPCError } from '@trpc/server'
import { createCourseSchema } from '@mirai/app'
import { trpc } from '../trpc'
import { z } from 'zod'
import { procedureWithInstitute } from '../procedures'

export const courseRouter = trpc.router({
  create: procedureWithInstitute.input(createCourseSchema).mutation(async ({ ctx, input }) => {
    const program = await ctx.prisma.course.create({
      data: input,
    })

    return program
  }),

  update: procedureWithInstitute
    .input(createCourseSchema.partial().extend({ id: z.number() }).omit({ instituteId: true }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      await ctx.prisma.course.update({
        where: { id },
        data,
      })
    }),

  getAll: procedureWithInstitute.input(z.number()).query(async ({ ctx, input }) => {
    const courses = await ctx.prisma.course.findMany({
      where: { instituteId: input },
      include: {
        department: {
          select: {
            name: true,
          },
        },
      },
    })

    return courses
  }),

  get: procedureWithInstitute
    .input(
      z.object({
        instituteId: z.number(),
        courseId: z.number(),
      }),
    )
    .query(async ({ ctx, input: { courseId, instituteId } }) => {
      const course = await ctx.prisma.course.findFirst({
        where: { id: courseId, instituteId },
      })

      if (course === null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Course not found !',
        })
      }

      return course
    }),
})

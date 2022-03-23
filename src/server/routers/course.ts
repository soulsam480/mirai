import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createCourseSchema } from 'components/course/ManageCourse';
import { createRouter } from 'server/createRouter';
import { isInstituteRole } from 'utils/helpers';
import { z } from 'zod';

export const courseRouter = createRouter()
  .middleware(({ ctx, next }) => {
    if (!ctx.user || !isInstituteRole(ctx.user.user.role).is) throw new TRPCError({ code: 'UNAUTHORIZED' });

    return next({
      // might seem dumb, but it's done like this to keep TS happy
      ctx: { ...ctx, user: ctx.user },
    });
  })
  .mutation('create', {
    input: createCourseSchema,
    async resolve({ ctx, input }) {
      const program = ctx.prisma.course.create({
        data: input,
      });

      return program;
    },
  })
  .mutation('update', {
    input: createCourseSchema.extend({ id: z.number() }).omit({ departmentId: true, instituteId: true }),
    async resolve({ ctx, input }) {
      const { id, ...data } = input;

      await ctx.prisma.course.update({
        where: { id },
        data,
      });
    },
  })
  .query('getAll', {
    input: z.number(),
    async resolve({ ctx, input }) {
      const courses = await ctx.prisma.course.findMany({
        where: { instituteId: input },
        include: {
          department: {
            select: {
              name: true,
            },
          },
        },
      });

      return courses;
    },
  })
  .query('get', {
    input: z.object({
      instituteId: z.number(),
      courseId: z.number(),
    }),
    async resolve({ ctx, input: { courseId, instituteId } }) {
      const course = await ctx.prisma.course.findFirst({
        where: { id: courseId, instituteId },
      });

      if (!course) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Course not found !',
        });
      }

      return course;
    },
  });

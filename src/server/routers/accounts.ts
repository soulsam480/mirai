import { TRPCError } from '@trpc/server';
import { createInstituteSchema } from 'components/institute/ManageInstitute';
// import { createStudentSchema } from 'pages/admin/student/manage/[[...id]]';
import { createRouter } from 'server/createRouter';
import { z } from 'zod';

export const accountRouter = createRouter()
  .middleware(({ ctx, next }) => {
    if (!ctx.user || ctx.user.user.role !== 'ADMIN')
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });

    return next({
      ctx: { ...ctx, user: ctx.user },
    });
  })
  .mutation('create_institute', {
    input: createInstituteSchema,
    async resolve({ ctx, input }) {
      const isDupId = await ctx.prisma.institute.findFirst({ where: { code: input.code }, select: { id: true } });

      if (isDupId) {
        throw new TRPCError({
          message: 'Duplicate Institute code',
          code: 'BAD_REQUEST',
        });
      }

      const institute = await ctx.prisma.institute.create({
        data: input,
      });

      return institute;
    },
  })
  .mutation('update_institute', {
    input: createInstituteSchema.merge(z.object({ instituteId: z.number() })),
    async resolve({ ctx, input }) {
      const { instituteId, ...data } = input;
      await ctx.prisma.institute.update({
        where: { id: input.instituteId },
        data,
      });
    },
  });
// .mutation('create_student', {
//   input: createStudentSchema,
//   async resolve({ ctx, input }) {
//     const student = await ctx.prisma.student.create({
//       data: input,
//     });

//     return student;
//   },
// });

import { TRPCError } from '@trpc/server';
import { createInstituteSchema } from 'pages/admin/institute/manage/[[...id]]';
import { createStudentSchema } from 'pages/admin/student/manage/[[...id]]';
import { createRouter } from 'server/createRouter';
import { z } from 'zod';
import { nanoid } from 'nanoid';

export const accountRouter = createRouter()
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
  .query('account_token', {
    input: z.object({
      accountId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const instituteData = await ctx.prisma.account.findFirst({
        where: { id: input.accountId },
        select: { id: true, name: true },
      });

      if (!instituteData)
        throw new TRPCError({
          message: 'Institute not found !',
          code: 'NOT_FOUND',
        });

      const token = nanoid();

      await ctx.prisma.account.update({ where: { id: input.accountId }, data: { accountToken: token } });

      return {
        token,
      };
    },
  })
  .mutation('create_student', {
    input: createStudentSchema,
    async resolve({ ctx, input }) {
      const student = await ctx.prisma.student.create({
        data: input,
      });

      return student;
    },
  });

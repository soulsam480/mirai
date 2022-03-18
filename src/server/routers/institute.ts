import { TRPCError } from '@trpc/server';
import { createRouter } from 'server/createRouter';
import { z } from 'zod';

/**
 * create department
 * create courses
 * create batches
 */

const createDepartmentSchema = z.object({
  name: z.string(),
  inCharge: z.string().optional(),
  instituteId: z.number(),
});

export const instituteRouter = createRouter()
  .middleware(({ ctx, next }) => {
    if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

    return next({
      ctx: { ...ctx, user: ctx.user },
    });
  })
  .query('get_institute', {
    input: z.number(),
    resolve: async ({ ctx, input }) => {
      const instituteData = await ctx.prisma.institute.findFirst({
        where: { id: input },
        include: {
          account: {
            select: ctx.prisma.$exclude('account', ['password', 'otp', 'otpExpiry', 'emailToken']),
          },
        },
      });

      if (!instituteData)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Institute not found !',
        });

      return instituteData;
    },
  });

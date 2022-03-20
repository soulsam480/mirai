import { TRPCError } from '@trpc/server';
import { createRouter } from 'server/createRouter';
import { z } from 'zod';

export const instituteRouter = createRouter()
  .middleware(({ ctx, next }) => {
    if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

    return next({
      // might seem dumb, but it's done like this to keep TS happy
      ctx: { ...ctx, user: ctx.user },
    });
  })
  .query('get', {
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
  })
  .middleware(({ ctx, next }) => {
    if (ctx.user.user.role !== 'ADMIN') throw new TRPCError({ code: 'UNAUTHORIZED' });

    return next({ ctx });
  })
  .query('get_all', {
    async resolve({ ctx }) {
      return await ctx.prisma.institute.findMany();
    },
  });

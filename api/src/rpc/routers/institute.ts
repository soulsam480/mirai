import { TRPCError } from '@trpc/server'
import { createRouter } from '../createRouter'
import { z } from 'zod'

export const instituteRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (ctx.user === null) throw new TRPCError({ code: 'UNAUTHORIZED' })

    const nextCtx = await next({
      // might seem dumb, but it's done like this to keep TS happy
      ctx: { ...ctx, user: ctx.user },
    })

    return nextCtx
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
      })

      if (instituteData == null)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Institute not found !',
        })

      return instituteData
    },
  })
  .middleware(async ({ ctx, next }) => {
    if (ctx.user.user.role !== 'ADMIN') throw new TRPCError({ code: 'UNAUTHORIZED' })

    const nextCtx = await next({ ctx })

    return nextCtx
  })
  .query('get_all', {
    async resolve({ ctx }) {
      const institutes = await ctx.prisma.institute.findMany()

      return institutes
    },
  })

import { TRPCError } from '@trpc/server'
import { createRouter } from '../createRouter'
import { z } from 'zod'
import { createInstituteSchema, tourSchema } from '@mirai/app'

export const accountRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (ctx.session === null)
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      })

    const nextCtx = await next({
      ctx: { ...ctx, session: ctx.session },
    })

    return nextCtx
  })
  .mutation('toggle_tour', {
    input: tourSchema,
    async resolve({ ctx, input: { id, showTour } }) {
      await ctx.prisma.account.update({
        where: { id },
        data: { showTour },
        select: { id: true, showTour: true },
      })
    },
  })
  .middleware(async ({ ctx, next }) => {
    if (ctx.session?.user.role !== 'ADMIN')
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      })

    const nextCtx = await next({
      ctx: { ...ctx, session: ctx.session },
    })

    return nextCtx
  })
  .mutation('create_institute', {
    input: createInstituteSchema,
    async resolve({ ctx, input }) {
      const isDupId = await ctx.prisma.institute.findFirst({ where: { code: input.code }, select: { id: true } })

      if (isDupId != null) {
        throw new TRPCError({
          message: 'Duplicate Institute code',
          code: 'BAD_REQUEST',
        })
      }

      const institute = await ctx.prisma.institute.create({
        data: input,
      })

      return institute
    },
  })
  .mutation('update_institute', {
    input: createInstituteSchema.merge(z.object({ instituteId: z.number() })),
    async resolve({ ctx, input }) {
      const { instituteId, ...data } = input
      await ctx.prisma.institute.update({
        where: { id: instituteId },
        data,
      })
    },
  })

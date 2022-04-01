import { TRPCError } from '@trpc/server'
import { createBatchSchema } from '@mirai/app'
import { isInstituteRole } from '../../lib'
import { createRouter } from '../createRouter'
import { z } from 'zod'

export const batchRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (ctx.user == null || !isInstituteRole(ctx.user.user.role).is) throw new TRPCError({ code: 'UNAUTHORIZED' })

    const newCtx = await next({
      // might seem dumb, but it's done like this to keep TS happy
      ctx: { ...ctx, user: ctx.user },
    })

    return newCtx
  })
  .mutation('create', {
    input: createBatchSchema,
    async resolve({ ctx, input }) {
      const batch = await ctx.prisma.batch.create({
        data: input,
      })

      return batch
    },
  })
  .mutation('update', {
    input: createBatchSchema.extend({ id: z.number() }),
    async resolve({ ctx, input }) {
      const { id, ...data } = input

      await ctx.prisma.batch.update({
        where: { id },
        data,
      })
    },
  })
  .query('getAll', {
    input: z.number(),
    async resolve({ ctx, input }) {
      const batches = await ctx.prisma.batch.findMany({
        where: { instituteId: input },
      })

      return batches
    },
  })
  .query('get', {
    input: z.object({
      instituteId: z.number(),
      batchId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const batch = await ctx.prisma.batch.findFirst({
        where: {
          id: input.batchId,
          instituteId: input.instituteId,
        },
      })

      if (batch === null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Batch not found !',
        })
      }

      return batch
    },
  })

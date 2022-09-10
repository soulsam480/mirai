import { TRPCError } from '@trpc/server'
import { createBatchSchema } from '@mirai/app'
import { trpc } from '../trpc'
import { z } from 'zod'
import { procedureWithInstitute } from '../procedures'

export const batchRouter = trpc.router({
  create: procedureWithInstitute.input(createBatchSchema).mutation(async ({ ctx, input }) => {
    const batch = await ctx.prisma.batch.create({
      data: input,
    })

    return batch
  }),

  update: procedureWithInstitute
    .input(createBatchSchema.extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      await ctx.prisma.batch.update({
        where: { id },
        data,
      })
    }),

  getAll: procedureWithInstitute.input(z.number()).query(async ({ ctx, input }) => {
    const batches = await ctx.prisma.batch.findMany({
      where: { instituteId: input },
    })

    return batches
  }),

  get: procedureWithInstitute
    .input(
      z.object({
        instituteId: z.number(),
        batchId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
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
    }),
})

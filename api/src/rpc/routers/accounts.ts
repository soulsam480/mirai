import { TRPCError } from '@trpc/server'
import { trpc } from '../trpc'
import { z } from 'zod'
import { createInstituteSchema, tourSchema } from '@mirai/app'
import { procedureWithAdmin, procedureWithSession } from '../procedures'

export const accountRouter = trpc.router({
  toggle_tour: procedureWithSession.input(tourSchema).mutation(async ({ ctx, input: { id, showTour } }) => {
    await ctx.prisma.account.update({
      where: { id },
      data: { showTour },
      select: { id: true, showTour: true },
    })
  }),

  create_institute: procedureWithAdmin.input(createInstituteSchema).mutation(async ({ ctx, input }) => {
    const isDupId = await ctx.prisma.institute.findFirst({ where: { code: input.code }, select: { id: true } })

    if (isDupId !== null) {
      throw new TRPCError({
        message: 'Duplicate Institute code',
        code: 'BAD_REQUEST',
      })
    }

    const institute = await ctx.prisma.institute.create({
      data: input,
    })

    return institute
  }),

  update_institute: procedureWithAdmin
    .input(createInstituteSchema.merge(z.object({ instituteId: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const { instituteId, ...data } = input

      await ctx.prisma.institute.update({
        where: { id: instituteId },
        data,
      })
    }),
})

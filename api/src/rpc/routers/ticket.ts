import { createTicketSchema, ticketListingInput } from '@mirai/app'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { hashPass, isRole } from '../../lib'
import { createRouter } from '../createRouter'

export const ticketRouter = createRouter()
  .query('get', {
    input: z.number(),
    async resolve({ ctx, input }) {
      const ticket = await ctx.prisma.ticket.findFirst({
        where: { id: input },
      })

      if (ticket == null)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Institute not found !',
        })
      return ticket
    },
  })
  .mutation('create', {
    input: createTicketSchema,
    async resolve({ ctx, input }) {
      const pass = input.meta.data.password
      if (pass !== undefined) {
        input.meta.data.password = await hashPass(pass)
      }

      const newToken = await ctx.prisma.ticket.create({
        data: input,
      })

      return newToken
    },
  })
  .middleware(async ({ ctx, next }) => {
    if (ctx.session === null || !(isRole(ctx.session.user.role).admin || isRole(ctx.session.user.role).instituteOrMod))
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    return await next({
      ctx: { ...ctx, session: ctx.session },
    })
  })
  // TODO: paginate
  .query('get_all', {
    input: ticketListingInput,
    async resolve({ ctx, input: { type, createdAt, ...rest } }) {
      const jsonQueries = []

      type !== undefined &&
        jsonQueries.push({
          meta: {
            path: ['type'],
            equals: type,
          },
        })

      /**
       * TODO
       * ////- support created after and before filters
       * - support sorting
       *   - createdAt asc and desc
       */

      const tickets = await ctx.prisma.ticket.findMany({
        where: {
          ...rest,
          AND: jsonQueries,
          createdAt: createdAt.value.length > 0 ? { [createdAt.type]: createdAt.value } : undefined,
        },
      })

      return tickets
    },
  })
  .mutation('update', {
    input: createTicketSchema.extend({ id: z.number() }),
    async resolve({ ctx, input }) {
      const { id, ...data } = input
      const newToken = await ctx.prisma.ticket.update({
        where: { id },
        data,
      })
      return newToken
    },
  })
  .mutation('remove', {
    input: z.number(),
    async resolve({ ctx, input }) {
      try {
        await ctx.prisma.ticket.delete({
          where: { id: input },
        })
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unable to delete ticket' })
      }
    },
  })

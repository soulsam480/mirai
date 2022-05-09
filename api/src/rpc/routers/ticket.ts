import { createTicketSchema, ticketFiltersSchema } from '@mirai/app'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { hashPass } from '../../lib'
import { createRouter } from '../createRouter'

export const ticketRouter = createRouter()
  .query('get_all', {
    input: ticketFiltersSchema,
    async resolve({ ctx, input: { instituteId, status, type } }) {
      const jsonQueries = []

      type !== undefined &&
        jsonQueries.push({
          meta: {
            path: ['type'],
            equals: type,
          },
        })

      status !== undefined &&
        jsonQueries.push({
          meta: {
            path: ['status'],
            equals: status,
          },
        })

      const tickets = await ctx.prisma.ticket.findMany({
        where: {
          instituteId,
          AND: jsonQueries,
        },
      })

      return tickets
    },
  })
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

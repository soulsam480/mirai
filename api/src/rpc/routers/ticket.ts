import { createTicketSchema } from '@mirai/app'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { hashPass } from '../../lib'
import { createRouter } from '../createRouter'

export const ticketRouter = createRouter()
  .query('getAll', {
    input: z.number(),
    async resolve({ ctx, input }) {
      const tickets = await ctx.prisma.ticket.findMany({
        where: { instituteId: input },
      })
      if (tickets == null)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Institute not found !',
        })

      return tickets
    },
  })
  .query('get', {
    input: z.object({
      id: z.number(),
      instituteId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const { instituteId, id } = input
      const ticket = await ctx.prisma.ticket.findFirst({
        where: { instituteId, id },
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

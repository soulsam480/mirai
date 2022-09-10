import { bulkTicketResolveSchema, createTicketSchema, ticketListingInput } from '@mirai/app'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { hashPass, isRole, isUniqueId } from '../../lib'
import { flowProducer } from '../../queues'
import { trpc } from '../trpc'

const adminInstitutedMiddleware = trpc.middleware(async ({ ctx, next }) => {
  if (ctx.session === null || !(isRole(ctx.session.user.role).admin || isRole(ctx.session.user.role).instituteOrMod))
    throw new TRPCError({ code: 'UNAUTHORIZED' })

  return await next({
    ctx: { ...ctx, session: ctx.session },
  })
})

export const ticketRouter = trpc.router({
  get: trpc.procedure.input(z.number()).query(async ({ ctx, input }) => {
    const ticket = await ctx.prisma.ticket.findFirst({
      where: { id: input },
    })

    if (ticket === null)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Institute not found !',
      })

    return ticket
  }),

  create: trpc.procedure.input(createTicketSchema).mutation(async ({ ctx, input }) => {
    if (!(await isUniqueId(input.meta.data.uniId, input.instituteId))) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'University ID should be unique' })
    }

    const pass = input.meta.data.password

    if (pass !== undefined) {
      input.meta.data.password = await hashPass(pass)
    }

    const newToken = await ctx.prisma.ticket.create({
      data: input,
    })

    return newToken
  }),

  get_all: trpc.procedure
    .use(adminInstitutedMiddleware)
    .input(ticketListingInput)
    .query(async ({ ctx, input: { type, createdAt, sort, ...rest } }) => {
      const jsonQueries = []

      type !== undefined &&
        jsonQueries.push({
          meta: {
            path: ['type'],
            equals: type,
          },
        })

      const tickets = await ctx.prisma.ticket.findMany({
        where: {
          ...rest,
          AND: jsonQueries,
          createdAt: createdAt.value.length > 0 ? { [createdAt.type]: createdAt.value } : undefined,
        },
        orderBy: { createdAt: sort },
      })

      return tickets
    }),

  action: trpc.procedure
    .use(adminInstitutedMiddleware)
    .input(bulkTicketResolveSchema)
    .mutation(async ({ input }) => {
      try {
        await flowProducer.add({
          name: `tickt-review-batch-${input.key}-${Date.now()}`,
          queueName: 'ticketBatch',
          data: {
            instituteId: input.key,
            size: input.data.length,
          },
          children: input.data.map((ticket) => {
            return {
              name: `ticket-review-${ticket.id}-${Date.now()}`,
              queueName: 'tickets',
              data: { ...ticket },
            }
          }),
        })

        return { success: true, data: null }
      } catch (error) {
        return { success: false, data: error }
      }
    }),

  remove: trpc.procedure
    .use(adminInstitutedMiddleware)
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.ticket.delete({
          where: { id: input },
        })
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unable to delete ticket' })
      }
    }),
})

import { TRPCError } from '@trpc/server'
import { isRole } from '../lib'
import { trpc } from './trpc'

export const sessionMiddleware = trpc.middleware(async ({ ctx, next }) => {
  if (ctx.session === null)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    })

  const nextCtx = await next({
    ctx: { session: ctx.session },
  })

  return nextCtx
})

export const instituteMiddleware = trpc.middleware(async ({ ctx, next }) => {
  if (ctx.session === null || !isRole(ctx.session.user.role).instituteOrMod)
    throw new TRPCError({ code: 'UNAUTHORIZED' })

  return await next({
    ctx: { session: ctx.session },
  })
})

export const adminMiddleware = trpc.middleware(async ({ ctx, next }) => {
  if (ctx.session?.user.role !== 'ADMIN')
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    })

  return await next({
    ctx: { session: ctx.session },
  })
})

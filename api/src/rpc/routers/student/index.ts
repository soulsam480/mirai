import { TRPCError } from '@trpc/server'
import { createRouter } from '../../createRouter'
import { experienceRouter } from './experience'

export const studentRouter = createRouter()
  // TODO: add logic for student-student queries, where a student shouldn't be
  // able to query another
  .middleware(async ({ ctx, next }) => {
    if (ctx.user === null)
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      })

    const nextCtx = await next({
      ctx: { ...ctx, user: ctx.user },
    })

    return nextCtx
  })
  .merge('experience.', experienceRouter)

import { TRPCError } from '@trpc/server'
import { createRouter } from '../createRouter'
import { z } from 'zod'
import { generateOnboardingUrlSchema, studentsQuerySchema } from '@mirai/schema'
import { onBoardingTokens } from '../../lib'
import dayjs from 'dayjs'

export const instituteRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (ctx.session === null) throw new TRPCError({ code: 'UNAUTHORIZED' })

    const nextCtx = await next({
      // might seem dumb, but it's done like this to keep TS happy
      ctx: { ...ctx, session: ctx.session },
    })

    return nextCtx
  })
  .query('get', {
    input: z.number(),
    resolve: async ({ ctx, input }) => {
      const instituteData = await ctx.prisma.institute.findFirst({
        where: { id: input },
        include: {
          account: {
            select: ctx.prisma.$exclude('account', ['password', 'otp', 'otpExpiry', 'emailToken']),
          },
        },
      })

      if (instituteData == null)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Institute not found !',
        })

      return instituteData
    },
  })
  // TODO: paginate
  .query('get_all_students', {
    input: studentsQuerySchema,
    async resolve({ ctx, input }) {
      const { name, uniId, ...rest } = input

      const students = await ctx.prisma.student.findMany({
        where: {
          ...rest,
          // we need to conditionally construct queries because with an
          // empty string, prisma advanced queries won't work
          uniId: uniId !== undefined ? { contains: uniId } : undefined,
          basics: name !== undefined ? { name: { startsWith: name, mode: 'insensitive' } } : undefined,
        },
        select: {
          instituteId: true,
          uniId: true,
          Batch: { select: { name: true, id: true } },
          Department: { select: { name: true, id: true } },
          basics: true,
          course: { select: { programName: true, id: true } },
          id: true,
          code: true,
        },
      })

      return students
    },
  })
  .mutation('gen_onboarding_token', {
    input: generateOnboardingUrlSchema,
    async resolve({ input }) {
      const token = onBoardingTokens.encode({
        ...input,
        createdAt: dayjs().toISOString(),
      })

      return token
    },
  })
  .middleware(async ({ ctx, next }) => {
    if (ctx.session.user.role !== 'ADMIN') throw new TRPCError({ code: 'UNAUTHORIZED' })

    const nextCtx = await next({ ctx })

    return nextCtx
  })
  .query('get_all', {
    async resolve({ ctx }) {
      const institutes = await ctx.prisma.institute.findMany()

      return institutes
    },
  })

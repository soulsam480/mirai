import { TRPCError } from '@trpc/server'
import { trpc } from '../trpc'
import { z } from 'zod'
import { generateOnboardingUrlSchema, studentsQuerySchema } from '@mirai/app'
import { onBoardingTokens } from '../../lib'
import dayjs from 'dayjs'
import { procedureWithSession } from '../procedures'

export const instituteRouter = trpc.router({
  get: procedureWithSession.input(z.number()).query(async ({ ctx, input }) => {
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
  }),

  // TODO: paginate
  get_all_students: procedureWithSession.input(studentsQuerySchema).query(async ({ ctx, input }) => {
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
  }),

  gen_onboarding_token: procedureWithSession.input(generateOnboardingUrlSchema).mutation(async ({ input }) => {
    const token = onBoardingTokens.encode({
      ...input,
      createdAt: dayjs().toISOString(),
    })

    return token
  }),

  get_all: procedureWithSession
    .use(async ({ ctx, next }) => {
      if (ctx.session.user.role !== 'ADMIN') throw new TRPCError({ code: 'UNAUTHORIZED' })

      const nextCtx = await next({ ctx })

      return nextCtx
    })
    .query(async ({ ctx }) => {
      const institutes = await ctx.prisma.institute.findMany()

      return institutes
    }),
})

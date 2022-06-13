import { TRPCError } from '@trpc/server'
import { nanoid } from 'nanoid'
import { LoginSchema, signupSchema } from '@mirai/app'
import { z } from 'zod'
import { createRouter } from '../createRouter'
import { authToken, comparePassword, hashPass, prismaQueryHelper } from '../../lib'

export const accountRole = ['STUDENT', 'INSTITUTE', 'INSTITUTE_MOD', 'ADMIN']

export const authRouter = createRouter()
  .mutation('sign_up', {
    input: signupSchema,
    async resolve({ ctx, input }) {
      const { role, instituteId, studentId, ...rest } = input

      if (['INSTITUTE_MOD', 'INSTITUTE'].includes(role) && instituteId === undefined)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Missing institute Id for account',
        })

      if (role === 'STUDENT' && studentId === undefined)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Missing student Id for account',
        })

      const relID =
        role === 'ADMIN'
          ? null
          : ['INSTITUTE_MOD', 'INSTITUTE'].includes(role)
          ? (instituteId as number)
          : (studentId as number)

      const account = await ctx.prisma.account.create({
        data: {
          ...rest,
          accountToken: nanoid(),
          role,
          // TODO: check owner relation
          instituteId: ['INSTITUTE_MOD', 'INSTITUTE'].includes(role) ? relID : null,
          studentId: role === 'STUDENT' ? relID : null,
          isOwner: role === 'INSTITUTE',
          emailVerified: false,
        },
      })

      return { ...account, password: undefined }
    },
  })
  .mutation('reset_password', {
    input: z.object({
      password: z.string().min(1),
      accountId: z.number(),
      token: z.string().min(1),
    }),
    async resolve({ input, ctx }) {
      const account = await ctx.prisma.account.findFirst({
        where: { id: input.accountId },
        select: { accountToken: true, id: true, instituteId: true },
      })

      if (account === null || account.instituteId === undefined)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: "Account or Institute doesn't exist",
        })

      const { accountToken, instituteId } = account

      if (account === null || instituteId === null || accountToken !== input.token)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Failed to change password !',
        })

      await ctx.prisma.institute.update({ where: { id: instituteId }, data: { status: 'INPROGRESS' } })

      await ctx.prisma.account.update({
        where: { id: input.accountId },
        data: { password: await hashPass(input.password), accountToken: null },
      })

      return {
        status: 'success',
      }
    },
  })
  .mutation('login', {
    input: LoginSchema,
    async resolve({ ctx, input: { email, password } }) {
      const account = await ctx.prisma.account.findFirst({
        where: { email },
      })

      if (account === null)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Account doeesn"t exist with the provided email',
        })

      if (account.password === null)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Please add password to continue !',
        })

      const isSamePassword = await comparePassword(password, account.password)

      if (isSamePassword)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid email or password',
        })

      return {
        ...account,
        password: undefined,
      }
    },
  })
  .middleware(async ({ ctx, next }) => {
    if (ctx.session === null)
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      })

    const nextCtx = await next({
      ctx: { ...ctx, session: ctx.session },
    })

    return nextCtx
  })
  .query('account', {
    async resolve({ ctx }) {
      const account = await prismaQueryHelper(ctx.prisma).getAccount(
        ctx.session.user.role,
        undefined,
        ctx.session.user.id,
      )

      if (account === null)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User account data not found',
        })

      return account
    },
  })
  .query('account_token', {
    input: z.object({
      accountId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const accountData = await ctx.prisma.account.findFirst({
        where: { id: input.accountId },
        select: { id: true, name: true },
      })

      if (accountData === null)
        throw new TRPCError({
          message: 'Institute not found !',
          code: 'NOT_FOUND',
        })

      const token = nanoid()

      await ctx.prisma.account.update({ where: { id: input.accountId }, data: { accountToken: token } })

      return {
        token,
      }
    },
  })
  .query('auth_token', {
    input: z.object({
      user: z.any(),
    }),
    async resolve({ input }) {
      const token = authToken.encode(input as any)

      return token
    },
  })
// TODO: add otp login setup
// .mutation('login', {
//   input: z.object({
//     email: z.string().email(),
//   }),
//   async resolve({ ctx, input }) {
//     //
//     const account = await ctx.prisma.account.findFirst({ where: { email: input.email } });

//     if (!account)
//       throw new TRPCError({
//         code: 'NOT_FOUND',
//         message: 'Account doeesn"t exist with the provided email',
//       });

//     const otp = nanoid();
//     const expiry = dayjs().add(10, 'm').toDate();
//   },
// });

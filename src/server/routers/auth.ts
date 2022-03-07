import { TRPCError } from '@trpc/server';
import { nanoid } from 'nanoid';
import { LoginSchema } from 'pages/login';
import { createRouter } from 'server/createRouter';
import { comparePassword, hashPass, prismaQueryHelper } from 'server/lib/auth';
import { z } from 'zod';

export const authRouter = createRouter()
  .mutation('sign_up', {
    input: z.object({
      email: z.string().email(),
      role: z.enum(['STUDENT', 'INSTITUTE', 'INSTITUTE_MOD', 'ADMIN']),
      instituteId: z.number().optional(),
      studentId: z.number().optional(),
      name: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const { role, instituteId, studentId, ...rest } = input;

      if (['INSTITUTE_MOD', 'INSTITUTE'].includes(role) && !instituteId)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Missing institute Id for account',
        });

      if (role === 'STUDENT' && !studentId)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Missing student Id for account',
        });

      const relID =
        role === 'ADMIN'
          ? null
          : ['INSTITUTE_MOD', 'INSTITUTE'].includes(role)
          ? (instituteId as number)
          : (studentId as number);

      const account = await ctx.prisma.account.create({
        data: {
          ...rest,
          emailToken: nanoid(),
          role,
          instituteId: relID,
          studentId: relID,
          isOwner: role === 'INSTITUTE',
          emailVerified: false,
        },
      });

      return account;
    },
  })
  .mutation('add_password', {
    input: z.object({
      password: z.string().min(1),
      accountId: z.number(),
      token: z.string().min(1),
    }),
    async resolve({ input, ctx }) {
      const account = await ctx.prisma.account.findFirst({
        where: { id: input.accountId },
        select: { accountToken: true, id: true },
      });

      if (!account)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: "Account doesn't exist",
        });

      const { accountToken } = account;

      if (accountToken !== input.token)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Failed to change password !',
        });

      await ctx.prisma.account.update({
        where: { id: input.accountId },
        data: { password: await hashPass(input.password), accountToken: null },
      });
    },
  })
  .mutation('login', {
    input: LoginSchema,
    async resolve({ ctx, input: { email, password } }) {
      const account = await ctx.prisma.account.findFirst({
        where: { email },
      });

      if (!account)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Account doeesn"t exist with the provided email',
        });

      if (!account.password)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Please add password to continue !',
        });

      const isSamePassword = await comparePassword(password, account.password);

      if (!isSamePassword)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid email or password',
        });

      return {
        ...account,
        password: undefined,
      };
    },
  })
  .query('account', {
    async resolve({ ctx }) {
      if (!ctx.user)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });

      const account = await prismaQueryHelper(ctx.prisma).getAccount(ctx.user.user.role, undefined, ctx.user.user.id);

      if (!account)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User account data not found',
        });

      return account;
    },
  });
//TODO: add otp login setup
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

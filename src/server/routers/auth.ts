import { TRPCError } from '@trpc/server';
// import dayjs from 'dayjs/esm';
// import { nanoid } from 'nanoid';
import { createRouter } from 'server/createRouter';
import { comparePassword, createTokens, hashPass } from 'server/lib/auth';
import { z } from 'zod';

export const authRouter = createRouter()
  .mutation('sign_up', {
    input: z.object({
      email: z.string().email(),
      role: z.enum(['STUDENT', 'INSTITUTE', 'INSTITUTE_MOD', 'ADMIN']),
      instituteId: z.number().optional(),
      studentId: z.number().optional(),
      password: z.string(),
      name: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const { role, instituteId, studentId, password, ...rest } = input;

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

      const hashedPass = await hashPass(password);

      const account = await ctx.prisma.account.create({
        data: {
          ...rest,
          role,
          instituteId: relID,
          studentId: relID,
          password: hashedPass,
          isOwner: role === 'INSTITUTE',
          emailVerified: false,
        },
      });

      return account;
    },
  })
  .mutation('login', {
    input: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
    async resolve({ ctx, input: { email, password } }) {
      const account = await ctx.prisma.account.findFirst({ where: { email } });

      if (!account)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Account doeesn"t exist with the provided email',
        });

      const isSamePassword = await comparePassword(password, account.password);

      if (!isSamePassword)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid email or password',
        });

      return {
        ...account,
        ...createTokens(`${account.id}`),
      };
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

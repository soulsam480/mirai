import { TRPCError } from '@trpc/server';
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

      const isSamePassword = await comparePassword(password, account.password);

      if (!isSamePassword)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid email or password',
        });

      if (!account)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'account data not found',
        });

      return {
        ...account,
        password: undefined,
      };
    },
  })
  // .query('refresh_token', {
  //   async resolve({ ctx }) {
  //     try {
  //       const refreshToken = ctx.req.cookies['refresh-token'];

  //       if (!refreshToken)
  //         return {
  //           accessToken: '',
  //           refetch: false,
  //         };

  //       const payload = <JwtPayload>verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  //       const account = await ctx.prisma.account.findFirst({
  //         where: { id: +payload.id },
  //         select: { id: true, role: true },
  //       });

  //       if (!account)
  //         return {
  //           accessToken: '',
  //           refetch: false,
  //         };

  //       const { accessToken, refreshToken: rtoken } = createTokens({ id: account.id, role: account.role });

  //       ctx.res.setHeader('Set-Cookie', rtoken);
  //     } catch (error) {
  //       return {
  //         accessToken: undefined,
  //         refetch: false,
  //       };
  //     }
  //   },
  // })
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

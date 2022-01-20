import { PrismaClient } from '@prisma/client';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { comparePassword } from 'server/lib/auth';

const secret = process.env.ACCESS_TOKEN_SECRET;

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  secret: process.env.REFRESH_TOKEN_SECRET,
  jwt: {
    secret,
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
    async signIn(data) {
      console.log(data);

      return true;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'Your email' },
        password: { label: 'Password', type: 'password' },
      },
      type: 'credentials',
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Email or password is missing');
        }

        const prisma = new PrismaClient();

        const user = await prisma.account.findFirst({
          where: { email: credentials.email },
          select: { password: true, role: true, id: true },
        });

        if (!user) {
          prisma.$disconnect();
          throw new Error('No account was found with the email');
        }

        const isSamePassword = await comparePassword(credentials.password, user.password);

        if (!isSamePassword) {
          prisma.$disconnect();
          throw new Error('Email or password is incorrect !');
        }

        return {
          email: credentials?.email,
          role: user.role,
          id: user.id,
        };
      },
    }),
  ],
  debug: true,
});

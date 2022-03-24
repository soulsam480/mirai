import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { miraiClient } from 'server/db'
import { comparePassword } from 'server/lib/auth'

const secret = process.env.ACCESS_TOKEN_SECRET

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
      if (user !== undefined) {
        token.id = user.id
        token.role = user.role
      }

      return token
    },
    session: ({ session, token }) => {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (token !== undefined) {
        session.user.id = token.id
        session.user.role = token.role
      }

      return session
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
        if (credentials === undefined || credentials.email.length === 0 || credentials?.password.length === 0)
          throw new Error('Email or password is missing')

        const user = await miraiClient.account.findFirst({
          where: { email: credentials?.email },
          select: { password: true, role: true, id: true },
        })

        void miraiClient.$disconnect()

        if (user == null || user.password === null || user.password?.length === 0)
          throw new Error('No account was found with the email')

        const isSamePassword = await comparePassword(credentials.password, user.password)

        if (!isSamePassword) throw new Error('Email or password is incorrect !')

        return {
          email: credentials.email,
          role: user.role,
          id: user.id,
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV !== 'production',
})

import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authorizeUser } from 'api'
import { AxiosError } from 'axios'

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  secret: process.env.REFRESH_TOKEN_SECRET,
  jwt: {
    secret: process.env.ACCESS_TOKEN_SECRET,
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

        const { email, password } = credentials

        try {
          const { data } = await authorizeUser({ email, password })

          return data
        } catch (error) {
          const { response } = error as AxiosError

          throw new Error((response?.data as string) ?? 'Unable to authorize user')
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV !== 'production',
})

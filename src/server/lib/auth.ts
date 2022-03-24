import { Role } from '@prisma/client'
import { compare, hash } from 'bcrypt'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { WithExcludeClient } from 'server/db'
import { User } from 'stores/user'
// don't make it an alias, the seed command will fail
import { getUserHome, isInstituteRole } from '../../utils/helpers'

export interface JwtPayload {
  id: number
  role: Role
  expiryDate?: number
}

export async function comparePassword(password: string, hashedPass: string) {
  return await compare(password, hashedPass)
}

export async function hashPass(password: string) {
  return await hash(password, parseInt(process.env.HASH))
}

export function prismaQueryHelper(client: WithExcludeClient) {
  return {
    async getAccount(role: 'STUDENT' | 'INSTITUTE' | 'INSTITUTE_MOD' | 'ADMIN', email?: string, id?: number) {
      let account: any

      if (role === 'STUDENT') {
        account = await client.account.findFirst({
          where: { email, id },
          include: { tenant: true },
        })
      } else if (isInstituteRole(role).is) {
        account = await client.account.findFirst({
          where: { email, id },
          select: {
            owner: true,
            ...client.$exclude('account', ['password', 'otp', 'otpExpiry', 'emailToken']),
          },
        })
      } else {
        account = await client.account.findFirst({
          where: { email, id },
          select: client.$exclude('account', ['password', 'otp', 'otpExpiry', 'emailToken']),
        })
      }

      return account as User
    },
  }
}

export function getServerSideAuthGuard(
  role: Role[],
  redirect = '/login',
  /**
   * Should only retunr props
   */
  serverFn?: GetServerSideProps,
): GetServerSideProps {
  return async (ctx) => {
    redirect = redirect ?? '/login'

    const session = await getSession({ req: ctx.req })

    if (session == null || !role.includes(session.user.role)) {
      return {
        redirect: {
          destination: session == null ? redirect : getUserHome(session.user.role),
          permanent: false,
        },
      }
    }

    return await (serverFn?.(ctx) ?? {
      props: {},
    })
  }
}

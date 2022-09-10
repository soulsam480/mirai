/**
 * ! Avoid exporting from this module to not have client side runtime errors
 */

import { Role } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import { WithExcludeClient } from '../db'
// don't make it an alias, the seed command will fail
import { getEnv, isInstituteRole } from '../lib/helpers'
import { SessionUser } from '../rpc/context'

export interface JwtPayload {
  id: number
  role: Role
  expiryDate?: number
}

export async function comparePassword(password: string, hashedPass: string) {
  return await bcrypt.compare(password, hashedPass)
}

export async function hashPass(password: string) {
  return await bcrypt.hash(password, parseInt(getEnv('HASH') ?? ''))
}

export function prismaQueryHelper(client: WithExcludeClient) {
  return {
    async getAccount(session: SessionUser) {
      const role = session?.user?.role
      const email = session?.user?.email
      const id = session?.user?.id

      let account: any

      if (role === 'STUDENT') {
        account = await client.account.findFirst({
          where: { email, id },
          select: {
            tenant: {
              include: {
                basics: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            ...client.$exclude('account', ['password', 'otp', 'otpExpiry', 'emailToken']),
          },
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

      return account
    },
  }
}

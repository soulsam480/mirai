/**
 * ! Avoid exporting from this module to not have client side runtime errors
 */

import { Role } from '@prisma/client'
import { compare, hash } from 'bcrypt'
import { WithExcludeClient } from '../db'
// don't make it an alias, the seed command will fail
import { getEnv, isInstituteRole } from '../lib/helpers'

export interface JwtPayload {
  id: number
  role: Role
  expiryDate?: number
}

export async function comparePassword(password: string, hashedPass: string) {
  return await compare(password, hashedPass)
}

export async function hashPass(password: string) {
  return await hash(password, parseInt(getEnv('HASH') ?? ''))
}

export function prismaQueryHelper(client: WithExcludeClient) {
  return {
    async getAccount(role: 'STUDENT' | 'INSTITUTE' | 'INSTITUTE_MOD' | 'ADMIN', email?: string, id?: number) {
      let account: any

      if (role === 'STUDENT') {
        account = await client.account.findFirst({
          where: { email, id },
          select: {
            tenant: true,
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

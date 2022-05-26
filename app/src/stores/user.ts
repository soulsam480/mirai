import type { Prisma } from '@prisma/client'
import { atom, useAtomValue } from 'jotai'

export type User = Omit<
  Prisma.AccountGetPayload<{
    include: {
      owner: true
      tenant: {
        include: {
          basics: {
            select: {
              name: true
            }
          }
        }
      }
    }
  }>,
  'password' | 'otp' | 'otpExpiry' | 'emailToken'
>

export const userAtom = atom<User | null>(null)
userAtom.debugLabel = 'userAtom'

export function useUser() {
  const userData = useAtomValue(userAtom)

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  if (userData === null) return {} as User

  return userData
}

export const loggedInAtom = atom((get) => get(userAtom) !== null)
loggedInAtom.debugLabel = 'loggedInAtom'

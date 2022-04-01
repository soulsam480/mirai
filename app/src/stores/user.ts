import type { Prisma } from '@prisma/client'
import { atom, useAtomValue } from 'jotai'

export type User = Omit<
  Prisma.AccountGetPayload<{
    include: { owner: true; tenant: true }
  }>,
  'password' | 'otp' | 'otpExpiry' | 'emailToken'
>

export const userAtom = atom<User | null>(null)

export function useUser() {
  const userData = useAtomValue(userAtom)

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  if (userData === null) return {} as User

  return userData
}

export const loggedInAtom = atom((get) => get(userAtom) !== null)

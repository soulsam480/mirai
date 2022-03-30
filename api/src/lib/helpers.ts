import { Role } from '@prisma/client'

export function isInstituteRole(role: 'STUDENT' | 'INSTITUTE' | 'INSTITUTE_MOD' | 'ADMIN') {
  return {
    isMod: role === 'INSTITUTE_MOD',
    isOwner: role === 'INSTITUTE',
    is: ['INSTITUTE', 'INSTITUTE_MOD'].includes(role),
  }
}

export function getUserHome(role: Role) {
  return role === 'ADMIN' ? '/admin' : isInstituteRole(role).is ? '/institute' : '/student'
}

export function getEnv(key: string, strict = false) {
  const val = process.env[key]

  if (strict && val === undefined) throw new Error(`env var ${key} is not defined`)

  return val
}

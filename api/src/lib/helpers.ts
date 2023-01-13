import { Role } from '@prisma/client'
import * as pino from 'pino'

export function isInstituteRole(role: 'STUDENT' | 'INSTITUTE' | 'INSTITUTE_MOD' | 'ADMIN') {
  return {
    isMod: role === 'INSTITUTE_MOD',
    isOwner: role === 'INSTITUTE',
    is: ['INSTITUTE', 'INSTITUTE_MOD'].includes(role),
  }
}

export function isRole(role: Role) {
  return {
    admin: role === 'ADMIN',
    institute: role === 'INSTITUTE',
    mod: role === 'INSTITUTE_MOD',
    student: role === 'STUDENT',
    instituteOrMod: ['INSTITUTE', 'INSTITUTE_MOD'].includes(role),
  }
}

export function getEnv(key: string, strict = process.env.NODE_ENV === 'production') {
  const val = process.env[key]

  if (strict && val === undefined) throw new Error(`env var ${key} is not defined`)

  return val
}

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
  },
})

export const logger = pino.pino(
  {
    hooks: {
      logMethod(args, method) {
        if (args.length > 1) {
          args[0] = args.filter(String).join('')
        }
        method.apply(this, args)
      },
    },
  },
  transport,
)

import { Role } from '@prisma/client'
import mongoose from 'mongoose'
import * as pino from 'pino'

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

export function isRole(role: Role) {
  return {
    admin: role === 'ADMIN',
    institute: role === 'INSTITUTE',
    mod: role === 'INSTITUTE_MOD',
    student: role === 'STUDENT',
    instituteOrMod: ['INSTITUTE', 'INSTITUTE_MOD'].includes(role),
  }
}

export function getEnv(key: string, strict = false) {
  const val = process.env[key]

  if (strict && val === undefined) throw new Error(`env var ${key} is not defined`)

  return val
}

const transport = pino.transport({
  target: 'pino-pretty',
  options: { colorize: true },
})

export const logger = pino.pino(transport)

export function getObjectId(val: string) {
  return new mongoose.Types.ObjectId(val)
}

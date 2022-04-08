import type { Role } from '@prisma/client'
import type { MLinkProps } from 'components/lib/MLink'
import dayjs from 'dayjs'

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

export async function copyToClip(value: string) {
  const isSupported = Boolean(Boolean(navigator) && 'clipboard' in navigator)

  if (!isSupported) return await Promise.reject(new Error('not supported'))

  void navigator.clipboard.writeText(value).then(async () => await Promise.resolve())
}

export function defineSidebar(base: string) {
  const stack: Array<Record<'path' | 'label', string> & { active?: MLinkProps['active'] }> = [
    {
      label: 'Home',
      path: base,
    },
  ]
  return {
    stack,
    extend(entries: typeof stack) {
      stack.push(...entries.map((e) => ({ ...e, path: base + e.path })))

      return stack
    },
  }
}

export function isSafeVal(val: any) {
  return typeof val === 'string' || typeof val === 'number'
}

export function formatDate(date: string | Date | null | undefined, format = 'MMM YYYY') {
  if (date === null || date === undefined) return ''
  return dayjs(date).format(format)
}

// ! Server only
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return ''
  }

  // reference for vercel.com
  if (process.env.VERCEL_URL !== undefined) {
    return `https://${process.env.VERCEL_URL}`
  }

  // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME !== undefined) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT ?? 3000}`
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

import type { Role } from '@prisma/client'
import dayjs from 'dayjs'
import type { NullToUndefined, SidebarItem } from 'types'

export const toString = (val: any) => Object.prototype.toString.call(val)

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
  const stack: SidebarItem[] = [
    {
      label: 'Home',
      path: base,
      icon: <IconLaHome />,
    },
  ]
  return {
    stack,
    extend(entries: SidebarItem[]) {
      stack.push(...entries.map((e) => ({ ...e, path: base + (e.path as string) })))

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

/**
 * Get deep diff of objects
 * @param toMatch base data
 * @param newData new data
 * @param asNullKeys convert `undefined` to `null`
 * @returns diff
 */
export function getDiff<
  T extends Record<string, any>,
  U extends Array<keyof T> = never[],
  V = U extends Array<infer W> ? W : never,
>(
  toMatch: T,
  newData?: Partial<T>,
  asNullKeys: U = [] as unknown as U,
): { [X in keyof T]: X extends V ? T[X] | undefined | null : NullToUndefined<T[X]> | undefined } {
  if (newData === undefined || newData === null) return {} as any

  function safeParseToString(val: any) {
    return toString(val) === '[object Date]' ? dayjs(val).toISOString() : val
  }

  function isISODateString(val: any) {
    return dayjs(val).isValid() && dayjs(val).toISOString() === val
  }

  function compareValues(a: any, b: any) {
    // if date make them strings
    a = safeParseToString(a)
    b = safeParseToString(b)

    // check for ISO strings, then compare dates
    if (isISODateString(a) || isISODateString(b)) {
      return formatDate(a, 'DD/MM/YYYY') === formatDate(b, 'DD/MM/YYYY')
    }

    return a === b
  }

  const result: any = {}

  Object.keys(toMatch).forEach((key: keyof T) => {
    const value = toMatch[key]
    const newValue = newData[key]

    if (Array.isArray(value) && Array.isArray(newValue)) {
      // skip arrays and send new
      result[key] = newValue
    }

    if (toString(value) === '[object Object]') {
      // deep object check
      const odiff = getDiff(value, newValue)

      if (Object.keys(odiff).length > 0) {
        result[key] = odiff as any

        return
      }
    }

    // if value's the same return
    if (compareValues(newValue, value)) return

    if (newValue === undefined && asNullKeys.includes(key)) {
      result[key] = null

      return
    }

    result[key] = newValue
  })

  return result
}

export async function sleep(ms: number): Promise<any> {
  return await new Promise((resolve) => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout)
      resolve(undefined)
    }, ms)
  })
}

import { useAlert } from 'components/lib/store/alerts'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { TRPCErrorType } from 'types'

export function useMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    return () => setMounted(false)
  }, [])
  return mounted
}

interface QueryConfig {
  /** query name */
  key: string
  /** redirect to ? */
  redirect: string
  /** error message */
  message: string
  /** Skip checking on a pathname */
  skipPath?: string
}

/**
 * Check for a query param strictly and redirect if it's not there
 */
// TODO: change this to useStrictIdCheck
export function useStrictQueryCheck({ key, redirect, message, skipPath: skip }: QueryConfig) {
  const { query, push, pathname } = useRouter()
  const setAlert = useAlert()

  const isQuery = useMemo(() => {
    const queryVal = query[key]

    return !(queryVal === undefined || isNaN(+queryVal))
  }, [query, key])

  useEffect(() => {
    if (skip !== undefined && pathname === skip) return

    const queryVal = query[key]

    if (queryVal === undefined || isNaN(+queryVal)) {
      setAlert({
        type: 'danger',
        message,
      })

      void push(redirect)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { isQuery }
}

export function useGlobalError() {
  const setAlert = useAlert()
  const [globalError, setError] = useState<TRPCErrorType | null>(null)

  useEffect(() => {
    if (globalError == null) return

    setAlert({
      message: globalError.message,
      type: 'danger',
    })

    setError(null)
  }, [globalError, setAlert])

  return setError
}

export function useQuery(key: string) {
  const { query } = useRouter()

  const queryVal = useMemo(() => query[key] as string | undefined, [query, key])

  const isQuery = useMemo(() => Boolean(queryVal), [queryVal])

  return {
    queryVal,
    isQuery,
  }
}

export function useDarkMode() {
  const localTheme = () => localStorage.getItem('mirai-theme')
  const docTheme = () => document.documentElement.getAttribute('data-theme')

  const [currentTheme, setCurrentTheme] = useState('corporate')

  function setTheme(theme: string) {
    localStorage.setItem('mirai-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)

    setCurrentTheme(theme)
  }

  function checkTheme() {
    if (typeof window === 'undefined') return

    const theme = localTheme()

    if (theme === null) return setTheme(docTheme() ?? 'corporate')
    if (theme === docTheme()) return

    setTheme(theme)
  }

  checkTheme()

  useEffectOnce(() => {
    setCurrentTheme(localTheme() ?? 'corporate')
  })

  return {
    setTheme,
    theme: currentTheme === 'corporate' ? 'light' : 'dark',
  }
}

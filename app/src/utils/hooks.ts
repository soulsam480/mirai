import { useAlert } from 'components/lib/store/alerts'
import { createPopper, Options } from '@popperjs/core'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { RefCallback, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { themeAtom } from 'stores/config'
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
    if (globalError === null) return

    setAlert({
      message: globalError.message ?? 'Something went wrong !',
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

export function useTheme() {
  const localTheme = () => localStorage.getItem('mirai-theme')
  const docTheme = () => document.documentElement.getAttribute('data-theme')

  const [currentTheme, setCurrentTheme] = useAtom(themeAtom)

  function setTheme(theme: string) {
    localStorage.setItem('mirai-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)

    void setCurrentTheme(theme)
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
    void setCurrentTheme(localTheme() ?? 'corporate')
  })

  return {
    setTheme,
    theme: currentTheme === 'corporate' ? 'light' : 'dark',
  }
}

/**
 * Example implementation to use Popper: https://popper.js.org/
 */
export function usePopper(options?: Partial<Options>): [RefCallback<Element | null>, RefCallback<HTMLElement | null>] {
  const reference = useRef<Element | null>(null)
  const popper = useRef<HTMLElement | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const cleanupCallback = useRef(() => {})

  const instantiatePopper = useCallback(() => {
    if (reference.current === null) return
    if (popper.current === null) return

    if (Boolean(cleanupCallback.current)) cleanupCallback.current()

    cleanupCallback.current = createPopper(reference.current, popper.current, options).destroy
  }, [reference, popper, cleanupCallback, options])

  return useMemo(
    () => [
      (referenceDomNode) => {
        reference.current = referenceDomNode
        instantiatePopper()
      },
      (popperDomNode) => {
        popper.current = popperDomNode
        instantiatePopper()
      },
    ],
    [reference, popper, instantiatePopper],
  )
}

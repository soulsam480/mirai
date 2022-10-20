import { Atom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { useCallback } from 'react'

export function useSelectAtom<T, K>(anAtom: Atom<T>, keyFn: (v: Awaited<T>) => K) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useAtomValue(selectAtom(anAtom, useCallback(keyFn, []) as any))
}

export * from './activeProfile'
export * from './config'
export * from './institute'
export * from './student'
export * from './ticket'
export * from './ticketFilters'
export * from './user'

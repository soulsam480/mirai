import { atom, useSetAtom } from 'jotai'

export const loaderAtom = atom(false)

export function useLoader() {
  const setLoader = useSetAtom(loaderAtom)

  return {
    /** Show the loader */
    show() {
      setLoader(true)
    },
    /** Hide the loader */
    hide() {
      setLoader(false)
    },
  }
}

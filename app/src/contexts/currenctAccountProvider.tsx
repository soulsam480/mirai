import { loaderAtom } from 'components/lib/store/loader'
import { useAtom, useSetAtom } from 'jotai'
import { useSession } from 'next-auth/react'
import React, { useEffect, useMemo } from 'react'
import { userAtom } from 'stores/user'
import { trpc } from 'utils/trpc'
import { useAtomsDevtools } from 'jotai/devtools'

interface Props {}

export const CurrentAccountProvider: React.FC<Props> = ({ children }) => {
  const [_, setUser] = useAtom(userAtom)
  const { data } = useSession()
  const setLoader = useSetAtom(loaderAtom)

  const enableQuery = useMemo(() => typeof window !== 'undefined' && data !== null, [data])

  const { isLoading } = trpc.useQuery(['auth.account'], {
    refetchOnWindowFocus: false,
    enabled: enableQuery,
    onSuccess(data) {
      data !== null && setUser(data)

      void setLoader(false)
    },
    onError() {
      void setLoader(false)
    },
  })

  useEffect(() => setLoader(isLoading), [isLoading, setLoader])

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAtomsDevtools('Mirai')
  }

  return <>{children}</>
}

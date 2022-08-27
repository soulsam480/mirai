import { useSetAtom } from 'jotai'
import { useSession } from 'next-auth/react'
import React from 'react'
import { userAtom } from '../stores'
import { trpc } from '../utils'
import { useAtomsDevtools } from 'jotai/devtools'
import { MSpinner } from '../components/lib'

interface Props {}

const FullPageLoader: React.FC = () => {
  return (
    <div id="loader-root" className="absolute inset-0 z-[10000] flex items-center justify-center bg-base-200">
      <MSpinner size="100px" thickness={4} />
    </div>
  )
}

export const CurrentAccount: React.FC<Props> = ({ children }) => {
  const setUser = useSetAtom(userAtom)
  const { data, status } = useSession()

  const { isLoading = true } = trpc.useQuery(['auth.account'], {
    refetchOnWindowFocus: false,
    enabled: status === 'authenticated' && Boolean(data),
    onSuccess(data) {
      data !== null && setUser(data)
    },
  })

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAtomsDevtools('Mirai')
  }

  if (status === 'loading' || isLoading) return <FullPageLoader />

  return <>{children}</>
}

import { useAtomValue } from 'jotai'
import { useRouter } from 'next/router'
import { loggedInAtom, useUser } from 'stores/user'
import { getUserHome } from 'utils/helpers'
import { trpc } from 'utils/trpc'

export function useDepartments() {
  const userData = useUser()
  const isLoggedIn = useAtomValue(loggedInAtom)
  const router = useRouter()

  const { data: departments = [], isLoading } = trpc.useQuery(['department.getAll', userData.instituteId as number], {
    enabled: isLoggedIn,
    onError(e) {
      if (e.data?.code === 'UNAUTHORIZED') {
        void router.push(getUserHome(userData.role))
      }
    },
  })

  return {
    departments,
    isLoading,
  }
}

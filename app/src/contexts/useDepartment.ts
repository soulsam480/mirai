import { useEffect, useMemo } from 'react'
import { loaderAtom } from 'components/lib/store/loader'
import { useAlert } from 'components/lib/store/alerts'
import { useAtomValue, useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { loggedInAtom, useUser } from 'stores/user'
import { QueryOptions } from 'types'
import { getUserHome } from 'utils/helpers'
import { trpc } from 'utils/trpc'
import { useStrictQueryCheck } from 'utils/hooks'

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

export function useDepartment(opts?: QueryOptions<'department.get'>) {
  opts = opts ?? {}

  const router = useRouter()
  const setAlert = useAlert()
  const userDate = useUser()
  const utils = trpc.useContext()
  const isLoggedIn = useAtomValue(loggedInAtom)
  const setLoader = useSetAtom(loaderAtom)

  const { isQuery } = useStrictQueryCheck({
    key: 'departmentId',
    redirect: '/institute/department',
    message: 'Department ID not found !',
    skipPath: '/institute/department/create',
  })

  const { data: department, isLoading } = trpc.useQuery(
    [
      'department.get',
      {
        instituteId: userDate.instituteId as number,
        departmentId: +(router.query.departmentId as string),
      },
    ],
    {
      onError(e) {
        if (e.data?.code === 'NOT_FOUND') {
          setAlert({ type: 'danger', message: 'Department not found' })

          void router.push('/institute/department')
        }
      },
      ...opts,
      enabled: isLoggedIn === true && isQuery,
    },
  )

  const update = trpc.useMutation(['department.update'], {
    onSuccess() {
      void utils.invalidateQueries(['department.getAll'])

      setAlert({
        type: 'success',
        message: 'Department updated',
      })

      void router.push('/institute/department')
    },
  })

  const create = trpc.useMutation(['department.create'], {
    onSuccess() {
      void utils.invalidateQueries(['department.getAll'])

      setAlert({
        type: 'success',
        message: 'Department created',
      })

      void router.push('/institute/department')
    },
  })
  const loading = useMemo(() => isLoading === true || update.isLoading, [isLoading, update.isLoading])
  useEffect(() => setLoader(loading), [loading, setLoader])

  return {
    department,
    create,
    update,
    isLoading,
  }
}

import { useEffect, useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { QueryOptions } from '../types'
import { loggedInAtom, useUser } from '../stores'
import { getUserHome, trpc, useStrictQueryCheck } from '../utils'
import { loaderAtom, useAlert } from '../components/lib'

export function useDepartments(opts?: QueryOptions<'department.getAll'>) {
  opts = opts ?? {}

  const userData = useUser()
  const isLoggedIn = useAtomValue(loggedInAtom)
  const router = useRouter()

  const { data: departments = [], isLoading } = trpc.useQuery(['department.getAll', userData.instituteId as number], {
    ...opts,
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
      enabled: isLoggedIn && isQuery,
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
  const loading = useMemo(() => isLoading || update.isLoading, [isLoading, update.isLoading])
  useEffect(() => setLoader(loading), [loading, setLoader])

  return {
    department,
    create,
    update,
    isLoading,
  }
}

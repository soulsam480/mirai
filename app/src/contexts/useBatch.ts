import { useEffect, useMemo } from 'react'
import { loaderAtom, useAlert } from '../components/lib'
import { getUserHome, trpc, useStrictQueryCheck } from '../utils'
import { useAtomValue, useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { loggedInAtom, useUser } from '../stores'
import { QueryOptions } from '../types'

export function useBatches(opts?: QueryOptions<'batch.getAll'>) {
  opts = opts ?? {}

  const userData = useUser()
  const isLoggedIn = useAtomValue(loggedInAtom)
  const router = useRouter()

  const { data: batches = [], isLoading } = trpc.useQuery(['batch.getAll', userData.instituteId as number], {
    ...opts,
    enabled: isLoggedIn,
    onError(e) {
      if (e.data?.code === 'UNAUTHORIZED') {
        void router.push(getUserHome(userData.role))
      }
    },
  })

  return { batches, isLoading }
}

export function useBatch(opts?: QueryOptions<'batch.get'>) {
  opts = opts ?? {}
  const userData = useUser()
  const isLoggedIn = useAtomValue(loggedInAtom)
  const router = useRouter()
  const setAlert = useAlert()
  const setLoader = useSetAtom(loaderAtom)
  const utils = trpc.useContext()

  const { isQuery } = useStrictQueryCheck({
    key: 'batchId',
    redirect: '/institute/batch',
    message: 'Batch ID not found !',
    skipPath: '/institute/batch/create',
  })

  const { data: batch, isLoading } = trpc.useQuery(
    [
      'batch.get',
      {
        instituteId: userData.instituteId as number,
        batchId: +(router.query.batchId as string),
      },
    ],
    {
      onError(e) {
        if (e.data?.code === 'NOT_FOUND') {
          setAlert({ type: 'danger', message: 'Batch not found' })
          void router.push('/insttute/batch')
        }
      },
      ...opts,
      enabled: isLoggedIn && isQuery,
    },
  )

  const update = trpc.useMutation(['batch.update'], {
    onSuccess() {
      void utils.invalidateQueries(['batch.getAll'])
      setAlert({
        type: 'success',
        message: 'Batch updated',
      })
      void router.push('/institute/batch')
    },
  })

  const create = trpc.useMutation(['batch.create'], {
    onSuccess() {
      void utils.invalidateQueries(['batch.getAll'])

      setAlert({
        type: 'success',
        message: 'Batch created',
      })

      void router.push('/institute/batch')
    },
  })

  const loading = useMemo(() => isLoading || update.isLoading, [isLoading, update.isLoading])
  useEffect(() => setLoader(loading), [loading, setLoader])

  return {
    batch,
    create,
    update,
    isLoading,
  }
}

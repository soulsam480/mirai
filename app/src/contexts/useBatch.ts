import { useEffect, useMemo } from 'react'
import { loaderAtom, useAlert } from '../components/lib'
import { getUserHome, trpc, useStrictQueryCheck } from '../utils'
import { useAtomValue, useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { loggedInAtom, useUser } from '../stores'
import { AnyObject } from '../types'

export function useBatches(opts?: AnyObject) {
  opts = opts ?? {}

  const userData = useUser()
  const isLoggedIn = useAtomValue(loggedInAtom)
  const router = useRouter()

  const { data: batches = [], isLoading } = trpc.batch.getAll.useQuery(userData.instituteId as number, {
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

export function useBatch(opts?: AnyObject) {
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

  const { data: batch, isLoading } = trpc.batch.get.useQuery(
    {
      instituteId: userData.instituteId as number,
      batchId: +(router.query.batchId as string),
    },

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

  const update = trpc.batch.update.useMutation({
    onSuccess() {
      void utils.batch.getAll.invalidate()
      setAlert({
        type: 'success',
        message: 'Batch updated',
      })
      void router.push('/institute/batch')
    },
  })

  const create = trpc.batch.create.useMutation({
    onSuccess() {
      void utils.batch.getAll.invalidate()

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

import { useAtomValue, useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { z } from 'zod'
import { loaderAtom, useAlert } from '../components/lib'
import { manageInstituteSchema } from '../schemas'
import { loggedInAtom, useUser } from '../stores'
import { QueryOptions } from '../types'
import { getUserHome, trpc, useStrictQueryCheck } from '../utils'

export function useInstitutes() {
  const userData = useUser()
  const isLoggedIn = useAtomValue(loggedInAtom)
  const router = useRouter()

  const { data: institutes = [], isLoading } = trpc.useQuery(['institute.get_all'], {
    enabled: isLoggedIn,
    onError(e) {
      if (e.data?.code === 'UNAUTHORIZED') {
        void router.push(getUserHome(userData.role))
      }
    },
  })

  return {
    institutes,
    isLoading,
  }
}

export function useInstitute(opts?: QueryOptions<'institute.get'>) {
  opts = opts ?? {}

  const router = useRouter()
  const setAlert = useAlert()
  const utils = trpc.useContext()
  const isLoggedIn = useAtomValue(loggedInAtom)
  const setLoader = useSetAtom(loaderAtom)

  const { isQuery } = useStrictQueryCheck({
    key: 'instituteId',
    redirect: '/admin/institute',
    message: 'Institute ID was not found !',
    skipPath: '/admin/institute/create',
  })

  const { data: institute, isLoading } = trpc.useQuery(['institute.get', +(router.query.instituteId as string)], {
    onError(e) {
      if (e.data?.code === 'NOT_FOUND') {
        setAlert({ type: 'danger', message: 'Institute not found' })

        void router.push('/admin/institute')
      }
    },
    ...opts,
    enabled: isLoggedIn && isQuery,
  })

  const signUp = trpc.useMutation(['auth.sign_up'], {
    onError: opts?.onError,
    onSuccess({ instituteId }) {
      if (instituteId === null) return

      setAlert({
        message: 'Institute created successfully !',
        type: 'success',
      })

      void router.push(`/admin/institute/${instituteId}`)
    },
  })

  const createInstitute = trpc.useMutation(['account.create_institute'], {
    onError: opts?.onError,
  })

  async function create({ email, ...rest }: z.infer<typeof manageInstituteSchema>) {
    const { id: instituteId } = await createInstitute.mutateAsync(rest)

    signUp.mutate({ role: 'INSTITUTE', email, instituteId, name: rest.name })
  }

  const update = trpc.useMutation(['account.update_institute'], {
    onSuccess() {
      void utils.invalidateQueries(['institute.get_all'])

      setAlert({
        type: 'success',
        message: 'Institute updated',
      })

      void router.push('/admin/institute')
    },
  })

  const loading = useMemo(
    () => isLoading || update.isLoading || signUp.isLoading || createInstitute.isLoading,
    [isLoading, update.isLoading, signUp.isLoading, createInstitute.isLoading],
  )

  useEffect(() => setLoader(loading), [loading, setLoader])

  return {
    update,
    isLoading: loading,
    institute,
    create,
  }
}

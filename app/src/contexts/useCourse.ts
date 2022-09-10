import { useAtomValue, useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { loaderAtom, useAlert } from '../components/lib'
import { loggedInAtom, useUser } from '../stores'
import { AnyObject } from '../types'
import { getUserHome, trpc, useStrictQueryCheck } from '../utils'

export function useCourses(opts?: AnyObject) {
  opts = opts ?? {}

  const userData = useUser()
  const isLoggedIn = useAtomValue(loggedInAtom)
  const router = useRouter()

  const { data: courses = [], isLoading } = trpc.course.getAll.useQuery(userData.instituteId as number, {
    ...opts,
    enabled: isLoggedIn,
    onError(e) {
      if (e.data?.code === 'UNAUTHORIZED') {
        void router.push(getUserHome(userData.role))
      }
    },
  })

  return {
    courses,
    isLoading,
  }
}

export function useCourse(opts?: AnyObject) {
  opts = opts ?? {}

  const router = useRouter()
  const setAlert = useAlert()
  const userData = useUser()
  const utils = trpc.useContext()
  const isLoggedIn = useAtomValue(loggedInAtom)
  const setLoader = useSetAtom(loaderAtom)

  const { isQuery } = useStrictQueryCheck({
    key: 'courseId',
    redirect: '/institute/course',
    message: 'Course ID was not found !',
    skipPath: '/institute/course/create',
  })

  const { data: course, isLoading } = trpc.course.get.useQuery(
    {
      instituteId: userData.instituteId as number,
      courseId: +(router.query.courseId as string),
    },

    {
      onError(e) {
        if (e.data?.code === 'NOT_FOUND') {
          setAlert({ type: 'danger', message: 'Course not found' })

          void router.push('/institute/course')
        }
      },
      ...opts,
      enabled: isLoggedIn && isQuery,
    },
  )

  const update = trpc.course.update.useMutation({
    onSuccess() {
      void utils.course.getAll.invalidate()

      setAlert({
        type: 'success',
        message: 'Course updated',
      })

      void router.push('/institute/course')
    },
  })

  const create = trpc.course.create.useMutation({
    onSuccess() {
      void utils.course.getAll.invalidate()

      setAlert({
        type: 'success',
        message: 'Course created',
      })

      void router.push('/institute/course')
    },
  })

  const loading = useMemo(() => isLoading || update.isLoading, [isLoading, update.isLoading])

  useEffect(() => setLoader(loading), [loading, setLoader])

  return {
    course,
    create,
    update,
    isLoading: isLoading || update.isLoading,
  }
}

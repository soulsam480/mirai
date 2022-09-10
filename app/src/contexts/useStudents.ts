import { AppRouter } from '@mirai/api'
import { inferProcedureOutput } from '@trpc/server'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/router'
import { studentFiltersAtom, loggedInAtom, useUser } from '../stores'
import { getUserHome, trpc } from '../utils'

export type StudentsListingType = inferProcedureOutput<AppRouter['institute']['get_all_students']> extends Array<
  infer U
>
  ? U
  : never

export function useStudents() {
  const router = useRouter()

  const userData = useUser()
  const isLoggedIn = useAtomValue(loggedInAtom)
  const studentFilters = useAtomValue(studentFiltersAtom)

  const {
    data: students = [],
    isLoading,
    refetch,
  } = trpc.institute.get_all_students.useQuery(
    { instituteId: Number(userData.instituteId), ...studentFilters },
    {
      enabled: isLoggedIn && userData.instituteId !== null,
      onError(e) {
        if (e.data?.code === 'UNAUTHORIZED') {
          void router.push(getUserHome(userData.role))
        }
      },
    },
  )

  return {
    students,
    isLoading,
    refetch,
  }
}

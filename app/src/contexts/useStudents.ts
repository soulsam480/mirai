import { useAtomValue } from 'jotai'
import { useRouter } from 'next/router'
import { studentFiltersAtom } from 'stores/student'
import { loggedInAtom, useUser } from 'stores/user'
import { getUserHome } from 'utils/helpers'
import { inferQueryOutput, trpc } from 'utils/trpc'

export type StudentsListingType = inferQueryOutput<'institute.get_all_students'> extends Array<infer U> ? U : never

export function useStudents() {
  const router = useRouter()

  const userData = useUser()
  const isLoggedIn = useAtomValue(loggedInAtom)
  const studentFilters = useAtomValue(studentFiltersAtom)

  const {
    data: students = [],
    isLoading,
    refetch,
  } = trpc.useQuery(['institute.get_all_students', { instituteId: Number(userData.instituteId), ...studentFilters }], {
    enabled: isLoggedIn === true && userData.instituteId !== null,
    onError(e) {
      if (e.data?.code === 'UNAUTHORIZED') {
        void router.push(getUserHome(userData.role))
      }
    },
  })

  return {
    students,
    isLoading,
    refetch,
  }
}

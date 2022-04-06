import { useAtomValue, useSetAtom } from 'jotai'
import { studentAtom } from 'stores/student'
import { loggedInAtom, useUser } from 'stores/user'
import { QueryOptions } from 'types'
import { trpc } from 'utils/trpc'

export function useStudent(opts?: QueryOptions<'student.get'>) {
  opts = opts ?? {}

  const isLoggedIn = useAtomValue(loggedInAtom)
  const userData = useUser()
  const setStudentVal = useSetAtom(studentAtom)

  const { data: student = null, isLoading } = trpc.useQuery(['student.get', userData.studentId as number], {
    ...opts,
    onSuccess(data) {
      opts?.onSuccess !== undefined && opts.onSuccess(data)

      // even though data is gurranteed to be not null
      // we still need the check for edge cases
      if (data === null) {
        return setStudentVal({
          basics: null,
          score: null,
          education: [],
          experience: [],
          skills: [],
          projects: [],
          certifications: [],
          base: null,
        })
      }

      const { basics, score, education, experience, projects, certifications, ...rest } = data

      void setStudentVal({
        basics,
        score,
        education,
        experience,
        projects,
        certifications,
        base: rest,
        skills: (rest.skills as string) ?? [],
      })
    },
    enabled: isLoggedIn === true && userData.studentId !== null,
  })

  return { student, isLoading }
}

// TODO: add useStudents for listing

// * Keep it at the bottom

export * from './experience'

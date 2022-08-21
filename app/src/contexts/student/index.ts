import { useAtomValue, useSetAtom } from 'jotai'
import { loggedInAtom, studentAtom, useUser } from '../../stores'
import { QueryOptions } from '../../types'
import { trpc } from '../../utils'

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
          course: null,
        })
      }

      const {
        basics,
        score,
        education,
        experience,
        projects,
        certifications,
        Batch,
        Department,
        course,
        institute,
        ...rest
      } = data

      void setStudentVal({
        basics: basics as unknown as any,
        score: score as unknown as any,
        education,
        experience,
        projects,
        certifications,
        base: rest,
        skills: (rest.skills as string) ?? [],
        course: {
          course: course as unknown as any,
          batch: Batch as unknown as any,
          department: Department as unknown as any,
          institute: institute as unknown as any,
        },
      })
    },
    enabled: isLoggedIn && userData.studentId !== null,
  })

  return { student, isLoading }
}

// TODO: add useStudents for listing

// * Keep it at the bottom

export * from './experience'
export * from './certification'
export * from './projects'
export * from './basics'
export * from './skills'
export * from './score'
export * from './education'

import { useSetAtom } from 'jotai'
import { useAlert } from '../../components/lib'
import { studentEducationAtom, useStudentUnverifiedSections, useUser } from '../../stores'
import { TRPCErrorType } from '../../types'
import { trpc, trpcClient } from '../../utils'

export function useEducation() {
  const setAlert = useAlert()
  const userData = useUser()
  const setEducation = useSetAtom(studentEducationAtom)
  const setUnverifiedSections = useStudentUnverifiedSections('education')

  const { mutateAsync: create, isLoading: isCreateLoading } = trpc.useMutation(['student.education.create'], {
    onError() {
      setAlert({
        type: 'danger',
        message: 'Unable to process request',
      })
    },
    onSuccess() {
      setAlert({
        type: 'success',
        message: 'Student education created successfully !',
      })
      void invalidate()
    },
  })
  const { mutateAsync: update, isLoading: isUpdateLoading } = trpc.useMutation(['student.education.update'], {
    onError() {
      setAlert({
        type: 'danger',
        message: 'Unable to process request',
      })
    },
    onSuccess() {
      setAlert({
        type: 'success',
        message: 'Student education updated successfully !',
      })
      void invalidate()
    },
  })

  async function deleteEducation(id: number) {
    try {
      await trpcClient.mutation('student.education.remove', id)

      setAlert({
        type: 'success',
        message: 'Education removed successfully !',
      })

      void invalidate()
    } catch (error) {
      const { message } = error as TRPCErrorType
      setAlert({
        message: message ?? 'Unable to process request !',
        type: 'danger',
      })
    }
  }

  async function invalidate() {
    if (userData.studentId === null) return

    const data = await trpcClient.query('student.education.get_all', userData.studentId)

    setUnverifiedSections(data)
    void setEducation(data)
  }

  return {
    create,
    update,
    deleteEducation,
    invalidate,
    isLoading: isCreateLoading || isUpdateLoading,
  }
}

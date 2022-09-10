import { useSetAtom } from 'jotai'
import { useAlert } from '../../components/lib'
import { studentEducationAtom, useUser } from '../../stores'
import { TRPCErrorType } from '../../types'
import { trpc, trpcClient } from '../../utils'

export function useEducation() {
  const setAlert = useAlert()
  const userData = useUser()
  const setEducation = useSetAtom(studentEducationAtom)

  const { mutateAsync: create, isLoading: isCreateLoading } = trpc.student.education.create.useMutation({
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

  const { mutateAsync: update, isLoading: isUpdateLoading } = trpc.student.education.update.useMutation({
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
      await trpcClient.student.education.remove.mutate(id)

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

    const data = await trpcClient.student.education.get_all.query(userData.studentId)

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

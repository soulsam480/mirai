import { useSetAtom } from 'jotai'
import { useAlert } from '../../components/lib'
import { studentExperienceAtom, useUser } from '../../stores'
import { TRPCErrorType } from '../../types'
import { trpc, trpcClient } from '../../utils'

export function useExperience() {
  const setAlert = useAlert()
  const userData = useUser()
  const setExperiences = useSetAtom(studentExperienceAtom)

  const { mutateAsync: create, isLoading: isCreateLoading } = trpc.student.experience.create.useMutation({
    onError() {
      setAlert({
        type: 'danger',
        message: 'Unable to process request',
      })
    },
    onSuccess() {
      setAlert({
        type: 'success',
        message: 'Experience created successfully !',
      })

      void invalidate()
    },
  })

  const { mutateAsync: update, isLoading: isUpdateLoading } = trpc.student.experience.update.useMutation({
    onError() {
      setAlert({
        type: 'danger',
        message: 'Unable to process request',
      })
    },
    onSuccess() {
      setAlert({
        type: 'success',
        message: 'Experience updated successfully !',
      })

      void invalidate()
    },
  })

  async function deleteExperience(id: number) {
    try {
      await trpcClient.student.experience.remove.mutate(id)

      setAlert({
        type: 'success',
        message: 'Experience removed successfully !',
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

    const data = await trpcClient.student.experience.get_all.query(userData.studentId)

    void setExperiences(data)
  }

  return {
    create,
    update,
    deleteExperience,
    invalidate,
    isLoading: isCreateLoading || isUpdateLoading,
  }
}

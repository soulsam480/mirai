import { useAlert } from 'components/lib/store/alerts'
import { TRPCErrorType } from 'types'
import { trpc, trpcClient } from 'utils/trpc'

export function useExperience() {
  const setAlert = useAlert()
  const utils = trpc.useContext()

  const { mutateAsync: create, isLoading: isCreateLoading } = trpc.useMutation(['student.experience.create'], {
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

      utils.invalidateQueries(['student.get'])
    },
  })

  const { mutateAsync: update, isLoading: isUpdateLoading } = trpc.useMutation(['student.experience.update'], {
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

      utils.invalidateQueries(['student.get'])
    },
  })

  async function deleteExperience(id: number) {
    try {
      await trpcClient.mutation('student.experience.remove', id)

      setAlert({
        type: 'success',
        message: 'Experience removed successfully !',
      })

      utils.invalidateQueries(['student.get'])
    } catch (error) {
      const { message } = error as TRPCErrorType
      setAlert({
        message: message ?? 'Unable to process request !',
        type: 'danger',
      })
    }
  }

  return {
    create,
    update,
    deleteExperience,
    isLoading: isCreateLoading === true || isUpdateLoading,
  }
}

import { useAlert } from 'components/lib/store/alerts'
import { trpc } from 'utils/trpc'

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

  return {
    create,
    update,
    isLoading: isCreateLoading === true || isUpdateLoading,
  }
}

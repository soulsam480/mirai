import { useAlert } from 'components/lib/store/alerts'
import { useSetAtom } from 'jotai'
import { studentCertificationsAtom } from 'stores/student'
import { useUser } from 'stores/user'
import { TRPCErrorType } from 'types'
import { trpc, trpcClient } from 'utils/trpc'

export function useCertification() {
  const setAlert = useAlert()
  const userData = useUser()
  const setCertifications = useSetAtom(studentCertificationsAtom)

  const { mutateAsync: create, isLoading: isCreateLoading } = trpc.useMutation(['student.certification.create'], {
    onError() {
      setAlert({
        type: 'danger',
        message: 'Unable to process request',
      })
    },
    onSuccess() {
      setAlert({
        type: 'success',
        message: 'Certification created successfully !',
      })

      void invalidate()
    },
  })

  const { mutateAsync: update, isLoading: isUpdateLoading } = trpc.useMutation(['student.certification.update'], {
    onError() {
      setAlert({
        type: 'danger',
        message: 'Unable to process request',
      })
    },
    onSuccess() {
      setAlert({
        type: 'success',
        message: 'Certification updated successfully !',
      })

      void invalidate()
    },
  })

  async function removeCertification(id: number) {
    try {
      await trpcClient.mutation('student.certification.remove', id)

      setAlert({
        type: 'success',
        message: 'Certification removed successfully !',
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

    const data = await trpcClient.query('student.certification.get_all', userData.studentId)

    void setCertifications(data)
  }

  return {
    create,
    update,
    removeCertification,
    invalidate,
    isLoading: isCreateLoading === true || isUpdateLoading,
  }
}

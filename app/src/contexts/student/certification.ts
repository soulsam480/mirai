import { useSetAtom } from 'jotai'
import { useAlert } from '../../components/lib'
import { studentCertificationsAtom, useUser } from '../../stores'
import { TRPCErrorType } from '../../types'
import { trpc, trpcClient } from '../../utils'

export function useCertification() {
  const setAlert = useAlert()
  const userData = useUser()
  const setCertifications = useSetAtom(studentCertificationsAtom)

  const { mutateAsync: create, isLoading: isCreateLoading } = trpc.student.certification.create.useMutation({
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

  const { mutateAsync: update, isLoading: isUpdateLoading } = trpc.student.certification.update.useMutation({
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
      await trpcClient.student.certification.remove.mutate(id)

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

    const data = await trpcClient.student.certification.get_all.query(userData.studentId)

    void setCertifications(data)
  }

  return {
    create,
    update,
    removeCertification,
    invalidate,
    isLoading: isCreateLoading || isUpdateLoading,
  }
}

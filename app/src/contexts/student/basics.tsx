import { useSetAtom } from 'jotai'
import { useAlert } from '../../components/lib'
import { studentBasicsAtom, useUser } from '../../stores'
import { trpc, trpcClient } from '../../utils'

export function useBasics() {
  const setAlert = useAlert()
  const userData = useUser()
  const setBasics = useSetAtom(studentBasicsAtom)

  const { mutateAsync: manage, isLoading } = trpc.student.basics.manage.useMutation({
    onError() {
      setAlert({
        type: 'danger',
        message: 'Unable to process request',
      })
    },
    onSuccess() {
      setAlert({
        type: 'success',
        message: 'Basics created successfully !',
      })

      void invalidate()
    },
  })

  async function invalidate() {
    if (userData.studentId === null) return

    const data = await trpcClient.student.basics.get.query(userData.studentId)

    void setBasics(data)
  }

  return {
    manage,
    invalidate,
    isLoading,
  }
}

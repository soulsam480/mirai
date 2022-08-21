import { useSetAtom } from 'jotai'
import { useAlert } from '../../components/lib'
import { studentBasicsAtom, useUser } from '../../stores'
import { trpc, trpcClient } from '../../utils'

export function useBasics() {
  const setAlert = useAlert()
  const userData = useUser()
  const setBasics = useSetAtom(studentBasicsAtom)

  const { mutateAsync: manage, isLoading } = trpc.useMutation(['student.basics.manage'], {
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

    const data = await trpcClient.query('student.basics.get', userData.studentId)

    void setBasics(data as any)
  }

  return {
    manage,
    invalidate,
    isLoading,
  }
}

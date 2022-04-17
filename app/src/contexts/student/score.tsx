import { useAlert } from 'components/lib/store/alerts'
import { useSetAtom } from 'jotai'
import { studentScoreAtom } from 'stores/student'
import { useUser } from 'stores/user'
import { trpc, trpcClient } from 'utils/trpc'

export function useScore() {
  const setAlert = useAlert()
  const userData = useUser()
  const setScore = useSetAtom(studentScoreAtom)

  const { mutateAsync: manage, isLoading } = trpc.useMutation(['student.score.manage'], {
    onError() {
      setAlert({
        type: 'danger',
        message: 'Unable to process request',
      })
    },
    onSuccess() {
      setAlert({
        type: 'success',
        message: 'Score updated successfully !',
      })

      void invalidate()
    },
  })

  async function invalidate() {
    if (userData.studentId === null) return

    const data = await trpcClient.query('student.score.get', userData.studentId)

    void setScore(data)
  }

  return {
    manage,
    isLoading,
    invalidate,
  }
}

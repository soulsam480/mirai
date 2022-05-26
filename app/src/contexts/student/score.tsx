import { useAlert } from 'components/lib/store/alerts'
import { useSetAtom } from 'jotai'
import { studentScoreAtom } from 'stores/student'
import { useUser } from 'stores/user'
import { trpc, trpcClient } from 'utils/trpc'

export function useScore() {
  const setAlert = useAlert()
  const userData = useUser()
  const setScore = useSetAtom(studentScoreAtom)

  const { mutate: updateScoreCard, isLoading } = trpc.useMutation(['student.score.update_score_card'], {
    onError() {
      setAlert({
        type: 'danger',
        message: 'Unable to process request',
      })
    },
    onSuccess(data) {
      setAlert({
        type: 'success',
        message: 'Score updated successfully !',
      })

      void setScore(data as unknown as any)

      void invalidate()
    },
  })

  async function invalidate() {
    if (userData.studentId === null) return

    const data = await trpcClient.query('student.score.get', userData.studentId)

    void setScore(data as any)
  }

  return {
    updateScoreCard,
    isLoading,
    invalidate,
  }
}

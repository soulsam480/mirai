import { useAlert } from '../../components/lib'
import { useSetAtom } from 'jotai'
import { useUser, studentScoreAtom } from '../../stores'
import { trpc, trpcClient } from '../../utils'

export function useScore() {
  const setAlert = useAlert()
  const userData = useUser()
  const setScore = useSetAtom(studentScoreAtom)

  const { mutate: updateScoreCard, isLoading } = trpc.student.score.update_score_card.useMutation({
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

    const data = await trpcClient.student.score.get.query(userData.studentId)

    void setScore(data as any)
  }

  return {
    updateScoreCard,
    isLoading,
    invalidate,
  }
}

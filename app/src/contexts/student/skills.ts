import { useAlert } from '../../components/lib'
import { useSetAtom } from 'jotai'
import { studentSkillsAtom } from '../../stores'
import { trpc } from '../../utils'

export function useSkills() {
  const setAlert = useAlert()
  const setSkills = useSetAtom(studentSkillsAtom)

  const { mutateAsync: update, isLoading } = trpc.student.skills.update.useMutation({
    onError() {
      setAlert({
        type: 'danger',
        message: 'Unable to process request',
      })
    },
    onSuccess(data) {
      setAlert({
        type: 'success',
        message: 'Certification created successfully !',
      })

      void setSkills(Array.isArray(data.skills ?? []) ? data.skills ?? [] : JSON.parse((data.skills as string) ?? '[]'))
    },
  })

  return {
    update,
    isLoading,
  }
}

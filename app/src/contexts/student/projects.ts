import { useAlert } from '../../components/lib/store'
import { useSetAtom } from 'jotai'
import { studentProjectsAtom, useUser } from '../../stores'
import { TRPCErrorType } from '../../types'
import { trpc, trpcClient } from '../../utils'

export function useProject() {
  const setAlert = useAlert()
  const userData = useUser()
  const setProjects = useSetAtom(studentProjectsAtom)

  const { mutateAsync: create, isLoading: isCreateLoading } = trpc.student.project.create.useMutation({
    onError() {
      setAlert({
        type: 'danger',
        message: 'Unable to process request',
      })
    },
    onSuccess() {
      setAlert({
        type: 'success',
        message: 'Project added successfully !',
      })

      void invalidate()
    },
  })

  const { mutateAsync: update, isLoading: isUpdateLoading } = trpc.student.project.update.useMutation({
    onError() {
      setAlert({
        type: 'danger',
        message: 'Unable to process request',
      })
    },
    onSuccess() {
      setAlert({
        type: 'success',
        message: 'Project updated successfully !',
      })

      void invalidate()
    },
  })

  async function deleteProject(id: number) {
    try {
      await trpcClient.student.project.remove.mutate(id)

      setAlert({
        type: 'success',
        message: 'Project removed successfully !',
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

    const data = await trpcClient.student.project.get_all.query(userData.studentId)

    void setProjects(data)
  }

  return {
    create,
    update,
    deleteProject,
    invalidate,
    isLoading: isCreateLoading || isUpdateLoading,
  }
}

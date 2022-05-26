import { useAlert } from 'components/lib/store/alerts'
import { useSetAtom } from 'jotai'
import { studentProjectsAtom } from 'stores/student'
import { useUser } from 'stores/user'
import { TRPCErrorType } from 'types'
import { trpc, trpcClient } from 'utils/trpc'

export function useProject() {
  const setAlert = useAlert()
  const userData = useUser()
  const setProjects = useSetAtom(studentProjectsAtom)

  const { mutateAsync: create, isLoading: isCreateLoading } = trpc.useMutation(['student.project.create'], {
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

  const { mutateAsync: update, isLoading: isUpdateLoading } = trpc.useMutation(['student.project.update'], {
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
      await trpcClient.mutation('student.project.remove', id)

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

    const data = await trpcClient.query('student.project.get_all', userData.studentId)

    void setProjects(data)
  }

  return {
    create,
    update,
    deleteProject,
    invalidate,
    isLoading: isCreateLoading === true || isUpdateLoading,
  }
}

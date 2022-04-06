import { trpc } from 'utils/trpc'

export function useExperience() {
  const { mutate: create, isLoading: isCreateLoading } = trpc.useMutation(['student.experience.create'])
  const { mutate: update, isLoading: isUpdateLoading } = trpc.useMutation(['student.experience.update'])

  return {
    create,
    update,
    isLoading: isCreateLoading === true || isUpdateLoading,
  }
}

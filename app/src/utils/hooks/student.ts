import { useAtomValue } from 'jotai'
import { instituteBatches, instituteCourses, instituteDepartments } from '../../stores'

export function useStudentAcademicMeta(params: { batchId: number; departmentId: number; courseId: number } | null) {
  const departments = useAtomValue(instituteDepartments)
  const courses = useAtomValue(instituteCourses)
  const batches = useAtomValue(instituteBatches)

  if (params === null) return null

  const { batchId, courseId, departmentId } = params

  return {
    department: departments.find(({ id }) => id === departmentId),
    course: courses.find(({ id }) => id === courseId),
    batch: batches.find(({ id }) => id === batchId),
  }
}

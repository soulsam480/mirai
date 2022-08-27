import { useDepartments, useBatches, useCourses } from './index'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { instituteAssetsLoading, instituteBatches, instituteCourses, instituteDepartments } from '../stores'

export function useInstituteAssets() {
  const setDepartments = useSetAtom(instituteDepartments)
  const setCourses = useSetAtom(instituteCourses)
  const setBatches = useSetAtom(instituteBatches)
  const setLoading = useSetAtom(instituteAssetsLoading)

  const { isLoading: department } = useDepartments({
    onSuccess(value) {
      void setDepartments(value)
    },
  })

  const { isLoading: course } = useCourses({
    onSuccess(value) {
      void setCourses(value)
    },
  })

  const { isLoading: batch } = useBatches({
    onSuccess(value) {
      void setBatches(value)
    },
  })

  useEffect(() => {
    void setLoading(department || course || batch)
  }, [department, batch, course, setLoading])
}

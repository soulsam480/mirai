import { useDepartments, useBatches, useCourses } from 'contexts'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { instituteAssetsLoading, instituteBatches, instituteCourses, instituteDepartments } from 'stores/institute'

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
    void setLoading(department === true || course || batch)
  }, [department, batch, course, setLoading])
}

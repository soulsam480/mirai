import React, { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { DepartmentFilter, DepartmentFilterPreview } from 'components/institute/student/filters/DepartmentFilter'
import { BatchFilter, BatchFilterPreview } from 'components/institute/student/filters/BatchFilter'
import { CourseFilter, CourseFilterPreview } from 'components/institute/student/filters/CourseFilter'
import { NameFilter, NameFilterPreview } from 'components/institute/student/filters/NameFilter'
import { UniIdFilter, UniIdFilterPreview } from 'components/institute/student/filters/UniIdFilter'
import MSpinner from 'components/lib/MSpinner'
import { instituteAssetsLoading } from 'stores/institute'
import { studentFiltersAtom } from 'stores/student'

interface Props {}

export const StudentFiltersBlock: React.FC<Props> = () => {
  const filtersLoading = useAtomValue(instituteAssetsLoading)
  const filters = useAtomValue(studentFiltersAtom)
  const hasAnyFilter = useMemo(() => {
    return Object.values(filters).some(Boolean)
  }, [filters])

  return filtersLoading === true ? (
    <div className="flex items-center space-x-2">
      <MSpinner size="20px" /> <span>Loading filters...</span>
    </div>
  ) : (
    <>
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
        <BatchFilter />
        <DepartmentFilter />
        <CourseFilter />
        <NameFilter />
        <UniIdFilter />
      </div>

      {hasAnyFilter && (
        <div className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-sm">
          <span>Students </span>
          <BatchFilterPreview />
          <DepartmentFilterPreview />
          <CourseFilterPreview />
          <NameFilterPreview />
          <UniIdFilterPreview />
        </div>
      )}
    </>
  )
}

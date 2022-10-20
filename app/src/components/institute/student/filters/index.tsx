import React from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { instituteAssetsLoading, studentFiltersAtom } from '../../../../stores'
import { MSpinner, MIcon } from '../../../lib'
import { BatchFilter, BatchFilterPreview } from './BatchFilter'
import { DepartmentFilter, DepartmentFilterPreview } from './DepartmentFilter'
import { CourseFilter, CourseFilterPreview } from './CourseFilter'
import { NameFilter, NameFilterPreview } from './NameFilter'
import { UniIdFilter, UniIdFilterPreview } from './UniIdFilter'
import IconPhX from '~icons/ph/x'

interface Props {}

export const StudentFiltersBlock: React.FC<Props> = () => {
  const filtersLoading = useAtomValue(instituteAssetsLoading)
  const [filters, setFilters] = useAtom(studentFiltersAtom)

  const hasAnyFilter = Object.values(filters).some(Boolean)

  return filtersLoading ? (
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

        {hasAnyFilter && (
          <button className="btn  btn-ghost btn-circle btn-sm" onClick={() => setFilters({})}>
            <MIcon className="tooltip tooltip-right tooltip-secondary text-lg" data-tip="Reset all">
              <IconPhX />
            </MIcon>
          </button>
        )}
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

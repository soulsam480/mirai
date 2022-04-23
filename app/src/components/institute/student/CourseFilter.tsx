import { MSelect } from 'components/lib/MSelect'
import { useAtom, useAtomValue } from 'jotai'
import React, { useMemo } from 'react'
import { instituteCourses } from 'stores/institute'
import { studentFiltersAtom } from 'stores/student'

interface Props {}

export const CourseFilter: React.FC<Props> = () => {
  const courses = useAtomValue(instituteCourses)

  const [filters, setFilters] = useAtom(studentFiltersAtom)

  const courseOptions = useMemo(
    () => courses.map(({ programName, id }) => ({ value: id, label: programName })),
    [courses],
  )

  return (
    <MSelect
      name="course"
      options={courseOptions}
      value={filters.courseId}
      palceholder="Select Course"
      onChange={(val) => {
        void setFilters((prev) => ({
          ...prev,
          courseId: val,
        }))
      }}
      reset
      width="max-content"
    />
  )
}

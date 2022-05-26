import { MSelect } from 'components/lib/MSelect'
import { useAtom, useAtomValue } from 'jotai'
import React, { useMemo } from 'react'
import { useSelectAtom } from 'stores/index'
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

export const CourseFilterPreview: React.FC = () => {
  const studentName = useSelectAtom(studentFiltersAtom, (v) => v.name)
  const courseId = useSelectAtom(studentFiltersAtom, (v) => v.courseId)
  const courses = useAtomValue(instituteCourses)

  const courseName = useMemo(() => courses.find((b) => b.id === courseId), [courseId, courses])

  if (courseId === undefined || courseName === undefined) return null

  return (
    <div className="text-sm">
      enrolled to <span className="font-semibold text-primary-focus">{courseName.programName}</span> course
      {Boolean(studentName) && ','}
    </div>
  )
}

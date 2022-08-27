import { useAtom, useAtomValue } from 'jotai'
import React, { useMemo } from 'react'
import { instituteDepartments, studentFiltersAtom, useSelectAtom } from '../../../../stores'
import { MSelect } from '../../../lib'

interface Props {}

export const DepartmentFilter: React.FC<Props> = () => {
  const departments = useAtomValue(instituteDepartments)

  const [filters, setFilters] = useAtom(studentFiltersAtom)

  const departmentOptions = useMemo(
    () => departments.map(({ name, id }) => ({ value: id, label: name })),
    [departments],
  )

  return (
    <MSelect
      name="department"
      options={departmentOptions}
      value={filters.departmentId}
      palceholder="Select department"
      onChange={(val) => {
        void setFilters((prev) => ({
          ...prev,
          departmentId: val,
        }))
      }}
      reset
      width="max-content"
    />
  )
}

export const DepartmentFilterPreview: React.FC = () => {
  const departmentId = useSelectAtom(studentFiltersAtom, (v) => v.departmentId)
  const batchId = useSelectAtom(studentFiltersAtom, (v) => v.batchId)
  const courseId = useSelectAtom(studentFiltersAtom, (v) => v.courseId)
  const departments = useAtomValue(instituteDepartments)

  const departmentName = useMemo(() => departments.find((b) => b.id === departmentId), [departmentId, departments])

  if (departmentId === undefined || departmentName === undefined) return null

  return (
    <div className="text-sm">
      {batchId === undefined && 'belong to'}{' '}
      <span className="font-semibold text-primary-focus">{departmentName.name}</span> department
      {courseId !== undefined && ','}
    </div>
  )
}

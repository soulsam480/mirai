import { MSelect } from 'components/lib/MSelect'
import { useAtom, useAtomValue } from 'jotai'
import React, { useMemo } from 'react'
import { instituteDepartments } from 'stores/institute'
import { studentFiltersAtom } from 'stores/student'

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
    />
  )
}

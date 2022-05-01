import { useSetAtom } from 'jotai'
import React, { useState } from 'react'
import { useDebounce } from 'react-use'
import { studentFiltersAtom } from 'stores/student'

interface Props {}

export const NameFilter: React.FC<Props> = () => {
  const setFilters = useSetAtom(studentFiltersAtom)

  const [value, setValue] = useState('')

  useDebounce(
    () => {
      void setFilters((prev) => ({ ...prev, name: value }))
    },
    500,
    [value],
  )

  return (
    <input
      className="input input-bordered input-primary input-sm"
      placeholder="Name"
      value={value}
      onChange={({ currentTarget }) => {
        setValue(currentTarget.value)
      }}
    />
  )
}

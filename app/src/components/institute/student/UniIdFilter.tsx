import { useSetAtom } from 'jotai'
import React, { useState } from 'react'
import { useDebounce } from 'react-use'
import { studentFiltersAtom } from 'stores/student'

interface Props {}

export const UniIdFilter: React.FC<Props> = () => {
  const setFilters = useSetAtom(studentFiltersAtom)

  const [value, setValue] = useState('')

  useDebounce(
    () => {
      void setFilters((prev) => ({ ...prev, uniId: value }))
    },
    500,
    [value],
  )

  return (
    <input
      className="input-bordered input-primary input input-sm"
      placeholder="Reg. number"
      value={value}
      onChange={({ currentTarget }) => {
        setValue(currentTarget.value)
      }}
    />
  )
}
